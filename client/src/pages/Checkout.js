import React from 'react';
import { Typography, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

function sendOrder() {
    const { id } = JSON.parse(window.localStorage.getItem('user'));
    const order = JSON.parse(window.localStorage.getItem('cart'));

    const orderData = {
        id,
        order
    }

    // send checkout request to server
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
                alert("There was an error: " + json.errors);
            }
        })
        .catch(err => {
            alert("It seems there is a problem with the server, try again later");
        })
}

export default function Checkout() {
    const classes = useStyles();

    return (
        <Container className={classes.paper} component="main">
            <Button variant="contained" onClick={sendOrder}>
                Submit order
            </Button>
        </Container>
    );
}