import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, CircularProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    paper: {

    },
}));

export default function Cart() {
    const classes = useStyles();

    const [cart, setCart] = useState(JSON.parse(window.localStorage.getItem('cart')));

    return (
        <Container className={classes.root}>
            {cart &&
                cart.map(item => {
                    <Typography>
                        <Grid container spacing={3}>

                            <Grid item xs={4}>
                                item.name
                            </Grid>

                            <Grid item xs={4}>
                                item.size
                            </Grid>

                            <Grid item xs={4}>
                                item.price
                            </Grid>
                    
                            <Grid item xs={4}>
                                item.quantity
                            </Grid>
                        </Grid>
                    </Typography>
                })
            }
        </Container>
    );
}