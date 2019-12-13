import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Box } from '@material-ui/core';
import BorderColorRoundedIcon from '@material-ui/icons/BorderColorRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import UserTab from '../components/Admin/UserTab';
import AddProductTab from '../components/Admin/AddProductTab';

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

function a11yProps(index) {
    return {
        id: `vertical-admin-tab-${index}`,
        'aria-controls': `vertical-admin-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    wrapper: {
        margin: 'auto',
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="vertical admin panel"
                className={classes.tabs}
                textColor="secondary"
            >
                <Tab label="Manage Users" icon={<AccountCircleRoundedIcon />} {...a11yProps(0)} />
                <Tab label="Add Product" icon={<AddCircleRoundedIcon />} {...a11yProps(1)} />
                <Tab label="Catering Requests" icon={<BorderColorRoundedIcon />} {...a11yProps(2)} />
            </Tabs>
            <div className={classes.wrapper}>
                <TabPanel value={value} index={0}>
                    <UserTab />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <AddProductTab />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
            </div>
        </div >
    );
}