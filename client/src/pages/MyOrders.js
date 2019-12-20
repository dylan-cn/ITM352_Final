import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Container, Grid, FormControl, Select, InputLabel } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    table: {
        marginTop: theme.spacing(4),
        width: '100%',
        overflowX: 'auto',
    },
}));

const locations = {
    Kakaako: "685 Auahi St #113, Honolulu, HI 96813",
    Kailua: "600 Kailua Rd, Kailua, HI 96734"
};

export default function AlignItemsList() {
    const classes = useStyles();

    const [orders, setOrders] = useState(null);
    const [status, setStatus] = useState("all");
    const [location, setLocation] = useState("all");

    useEffect(() => {
        fetch('/api/orders/userorders', {
            method: 'GET',
            headers: {
                'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token,
            },
        })
            .then(res => res.json())
            .then(json => {
                // Products retrieval was successful
                if (json.success) {
                    setOrders(json.orders);
                } else {
                    //setErrors('Could not retrieve products from database...');
                }
            })
            .catch(err => {
                //setErrors('Could not retrieve products from database...');
            })
            .finally(() => {
                //setIsLoading(false);
            });
    }, []);

    function handleStatusFilter(e) {
        setStatus(e.target.value);
    }

    function handleLocationFilter(e) {
        setLocation(e.target.value);
    }

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="filled" className={classes.formControl} fullWidth>
                        <InputLabel htmlFor="status-select">Status</InputLabel>
                        <Select
                            native
                            onChange={handleStatusFilter}
                            inputProps={{
                                name: 'status',
                                id: 'status-select',
                            }}
                        >
                            <option value={"all"}>All</option>
                            <option value={'yes'}>Done</option>
                            <option value={'no'}>Not Done</option>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl variant="filled" className={classes.formControl} fullWidth>
                        <InputLabel htmlFor="status-select">Location</InputLabel>
                        <Select
                            native
                            onChange={handleLocationFilter}
                            inputProps={{
                                name: 'location',
                                id: 'location-select',
                            }}
                        >
                            <option value="all">All</option>
                            {Object.entries(locations).map(([key, value]) => {
                                return (
                                    <option value={key} key={value + key}>{key}</option>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Paper className={classes.table}>
                <Table aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Location</TableCell>
                            <TableCell align="center">Order</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders &&
                            orders
                                .filter(elem => {
                                    if (status === 'yes') {
                                        return elem.finished;
                                    } else if (status === 'no') {
                                        return !elem.finished;
                                    } else {
                                        return true;
                                    }
                                })
                                .filter(elem => {
                                    if (location === 'all') {
                                        return true;
                                    } else {
                                        return location === elem.location;
                                    }
                                })
                                .map(order => (
                                    <OrderRow key={order._id} orderInfo={order} />
                                ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

// Component to create the an order row in the order table 
function OrderRow({ orderInfo }) {
    const classes = useStyles();

    const [order] = useState({ ...orderInfo });

    // Component to return an order row
    return (
        <TableRow>
            <TableCell align="center">{new Date(order.date).toString() || "N/A"}</TableCell>
            <TableCell align="center">
                {!order.finished &&
                    <Typography>
                        <strong>Not Done</strong>
                    </Typography>
                }

                {order.finished &&
                    <Typography>
                        <strong>Done</strong>
                    </Typography>
                }
            </TableCell>
            <TableCell align="center">{order.location}</TableCell>
            <TableCell align="center">
                <List className={classes.root}>
                    {order &&
                        order.order.map(item => {
                            return (
                                <div key={item.picture + item.name + item.quantity + orderInfo.firstName + orderInfo.lastName}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        {item.size}
                                                        <br />
                                                        Qty: {item.quantity}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                    <Divider />

                                </div>
                            );
                        })
                    }
                </List>
            </TableCell>
        </TableRow>
    );
}