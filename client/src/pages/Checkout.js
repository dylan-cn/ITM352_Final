import React, { useEffect } from 'react';
import { Typography, Container, Button, Grid, TextField, FormControl, InputLabel, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

// Send order request to server
function sendOrder(e) {
    e.preventDefault();

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
}

// Function for location
function handleLocation(e) {
    window.localStorage.setItem("location", e.target.value)
}

// Locations
const locations = {
    Kakaako: "685 Auahi St #113, Honolulu, HI 96813",
    Kailua: "600 Kailua Rd, Kailua, HI 96734"
};

export default function Checkout() {
    const classes = useStyles();

    // Set default location
    useEffect(() => {
        window.localStorage.setItem("location", Object.keys(locations)[0]);
    }, []);

    const temp = JSON.parse(window.localStorage.getItem('cart'));
    const cart = temp ? temp.cart : null;

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
                    <Button variant="contained" type="submit" style={{ float: 'right' }}>
                        Submit order
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