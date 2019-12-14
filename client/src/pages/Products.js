import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ProductCard from '../components/Product/ProductCard';

const useStyles = makeStyles(theme => ({
    paper: {
        card: {
            maxWidth: 345,
        },
        root: {
            flexGrow: 1,
        },
        wrapper: {
            marginTop: theme.spacing(2),
        }
    }
}));

const products = [
    {
        "_id": {
            "$oid": "5df4313e532474c03bf3d240"
        },
        "name": "Yogurt",
        "description": "some yogurt",
        "prices": {
            "Small": "5",
            "Medium": "10.55"
        },
        "picture": "/images/49d76cdf-ea74-4240-930d-b37989917192yogurt.jpg",
        "__v": 0
    },
    {
        "_id": {
            "$oid": "5df4315a532474c03bf3d241"
        },
        "name": "Salmon",
        "description": "some yogurt",
        "prices": {
            "One Size": "15.99"
        },
        "picture": "/images/cc34bd4e-dc73-46ed-a534-0b18a3327d2dsalmon.jpg",
        "__v": 0
    },
    {
        "_id": {
            "$oid": "5df4316f532474c03bf3d242"
        },
        "name": "Coffee",
        "description": "some yogurt",
        "prices": {
            "One Size": "9.59"
        },
        "picture": "/images/eefa2d85-e7b2-4027-aec7-a94f1bcabdd9cappuccino.jpg",
        "__v": 0
    }

]

export default function Products() {
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <div className={classes.wrapper}>
                <Grid container spacing={3}>
                    {products.map((item, idx) => {
                        return (
                            <Grid item xs={6} md={4} key={idx + item}>
                                <ProductCard productData={item} key={item._id} />
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        </Container>
    );
}