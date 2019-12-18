import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, CircularProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    paper: {

    },
    root: {
        
    },
}));

export default function Cart() {
    const classes = useStyles();

    const [cart, setCart] = useState(JSON.parse(window.localStorage.getItem('cart')));

    return (
        <Container className={classes.root}>
            {cart ?
                cart.map(item => {
                    return (
                        <Grid container spacing={3}>

                            <Grid item xs={3}>
                                {item.name}
                            </Grid>

                            <Grid item xs={3}>
                                {item.size}
                            </Grid>

                            <Grid item xs={3}>
                                {item.price}
                            </Grid>

                            <Grid item xs={3}>
                                {item.quantity}
                            </Grid>
                        </Grid>
                    );
                })
                :
                <Typography>
                    No items in cart
                </Typography>
            }
        </Container>
    );
}