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
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -32,
        marginLeft: -32,
    },
}));

const categories = [
    'All',
    'Coffee',
    'Tea',
    'Specialty',
    'Food',
    'Catering'
];

export default function Tabss() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [products, setProducts] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetches products from data base on load
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
                setErrors('Could not retrieve products from database...\n' + err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <Paper className={classes.root}>
            <Container>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        {
                            categories.map(item => {
                                return <Tab key={item} label={item} />
                            })
                        }
                    </Tabs>
                </AppBar>

                {!errors && isLoading &&
                    <CircularProgress size={64} className={classes.spinner} />
                }

                {!errors && !isLoading &&
                    categories.map((category, idx) => {
                        return (
                            <TabPanel value={value} index={idx} key={idx}>
                                {products &&
                                    <Grid container spacing={3}>
                                        {products
                                            .filter(product => {
                                                if (category.toLowerCase() === 'all') {
                                                    return true;
                                                } else {
                                                    return product.category.toLowerCase() === category.toLowerCase();
                                                }
                                            })
                                            .map((item, idx) => {
                                                return (
                                                    <Grid item xs={6} md={4} key={idx + item}>
                                                        <ProductCard productData={item} key={item._id} />
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>
                                }
                            </TabPanel>
                        )
                    })
                }

                {errors &&
                    <Typography align="center" variant="h4" component="h2">
                        {errors}
                    </Typography>
                }
            </Container>
        </Paper>
    );
}

// Panels for tab
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