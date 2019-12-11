import React, { useEffect } from 'react';
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

export default function UserTab() {
    const classes = useStyles();

    return (
        <div>
            <Typography component="h1" variant="h5">
                This is the user tab
            </Typography>
        </div>
    );
}