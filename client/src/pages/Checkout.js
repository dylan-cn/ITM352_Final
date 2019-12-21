import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Typography, Container, Button, Grid, TextField, FormControl, InputLabel, Select, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
}));

// Locations
const locations = {
    Kakaako: "685 Auahi St #113, Honolulu, HI 96813",
    Kailua: "600 Kailua Rd, Kailua, HI 96734"
};

export default function Checkout() {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [timer, setTimer] = useState(null);
    const [interval, setIntervalTime] = useState(null);

    // Set default location
    useEffect(() => {
        window.localStorage.setItem("location", Object.keys(locations)[0]);
    }, []);

    // Send order request to server
    function sendOrder(e) {
        e.preventDefault();
        setLoading(true);

        const { id } = JSON.parse(window.localStorage.getItem('user'));
        const order = JSON.parse(window.localStorage.getItem('cart')).cart;

        const orderData = {
            id,
            order,
            location: window.localStorage.getItem("location"),
        }

        // send to server
        fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
            .then(res => res.json())
            .then(json => {
                // checkout was a success
                if (json.success) {
                    // remove cart from localstorage
                    window.localStorage.removeItem('cart');

                    alert("You order has been sent");
                } else {
                    alert("There was an error sending order");
                }
            })
            .catch(err => {
                alert("It seems there is a problem with the server, try again later");
            })
            .finally(() => {
                setLoading(false);
                setPurchased(true);
                setTimer(5);
                setIntervalTime(setInterval(function () {
                    setTimer(prevState => prevState -= 1)
                }, 1000));
            })
    }

    // Function for location
    function handleLocation(e) {
        window.localStorage.setItem("location", e.target.value)
    }

    const temp = JSON.parse(window.localStorage.getItem('cart'));
    const cart = temp ? temp.cart : null;

    // If purchase is submitted, redirect to products page
    if (purchased) {
        // When timer is up, redirect
        if (timer && timer <= 0) {
            clearInterval(interval);
            return (<Redirect to={{ pathname: '/products' }} />);
        }

        // Else display redirect confirmation
        return (
            <Typography align='center'>
                Thank you for making your purchase
                <br />
                You will be redirected to products in {timer} seconds
            </Typography>
        );
    }

    return (
        <Container className={classes.paper} component="main">
            <Typography component="h1" variant="h5">
                Checkout
            </Typography>
            <Typography>
                Mockup checkout; no functionality
            </Typography>
            {cart && cart.length > 0 ?
                <form onSubmit={sendOrder}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="filled" className={classes.formControl} fullWidth>
                                <InputLabel htmlFor="size-select">Pick Up Location</InputLabel>
                                <Select
                                    native
                                    onChange={handleLocation}
                                    inputProps={{
                                        name: 'location',
                                        id: 'location-select',
                                    }}
                                    style={{ height: 50 }}
                                >
                                    {Object.entries(locations).map(([key, value]) => {
                                        return (
                                            <option value={key} key={value + key}>{value}</option>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="address"
                                label="Address"
                                name="address"
                                autoComplete="address"
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="card"
                                label="Card Number"
                                name="card"
                                autoComplete="card"
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="expiration-date"
                                label="Expiration Date"
                                name="expiration-date"
                                autoComplete="expiration-date"
                            />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="security"
                                label="Security Code"
                                name="security"
                                autoComplete="code"
                            />
                        </Grid>
                    </Grid>

                    <br />
                    <Button variant="contained" type="submit" className={classes.wrapper} disabled={loading} style={{ float: 'right' }}>
                        Submit order
                        {loading &&
                            <CircularProgress size={16} className={classes.spinner} />
                        }
                    </Button>
                </form>
                :
                <>
                    <br />
                    <Typography component="h1" variant="h5">
                        No items in cart!
                    </Typography>
                </>
            }
        </Container>
    );
}