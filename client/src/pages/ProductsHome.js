import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import ProductCard from '../components/Product/ProductCard';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Tabss() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [products, setProducts] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetches products from data base
    useEffect(() => {
        fetch('/api/products', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(json => {
                // Products retrieval was successful
                if (json.success) {
                    setProducts(json.products);
                } else {
                    setErrors('Could not retrieve products from database...');
                }
            })
            .catch(err => {
                setErrors('Could not retrieve products from database...');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <Paper className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="All" />
                    <Tab label="Coffee" />
                    <Tab label="Tea" />
                    <Tab label="Specialty Beverages" />
                    <Tab label="Food" />
                    <Tab label="Catering" />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
                {products && <Grid container spacing={3}>
                    {products.map((item, idx) => {
                        return (
                            <Grid item xs={6} md={4} key={idx + item}>
                                <ProductCard productData={item} key={item._id} />
                            </Grid>
                        );
                    })}
                </Grid>}
            </TabPanel>

        </Paper>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};