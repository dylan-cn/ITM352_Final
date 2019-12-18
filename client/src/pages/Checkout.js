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

export default function Checkout() {
    const classes = useStyles();

    return (
        <Container className={classes.paper} component="main">
            <Button variant="contained">
                Submit order
            </Button>
        </Container>
    );
}