import React from 'react';
import { Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export default function NotFound() {
    const classes = useStyles();

    return (
        <Container className={classes.paper} component="main">
            <Typography align="center" component="h1" variant="h2">
                404 Page Not Found
            </Typography>
            <Typography align="center" component="h1" variant="h6">
                It seems you landed on a page that does not exist!
            </Typography>
        </Container>
    );
}