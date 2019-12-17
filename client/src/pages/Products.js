import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, CircularProgress, Typography } from '@material-ui/core';
import ProductCard from '../components/Product/ProductCard';

const useStyles = makeStyles(theme => ({
    paper: {
        
    }, 
    card: {
        maxWidth: 345,
    },
    root: {
        flexGrow: 1,
    },
    wrapper: {
        marginTop: theme.spacing(2),
    },
    largeSpinner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -32,
      marginLeft: -32,
    },
}));

export default function Products() {
    const classes = useStyles();

    const [products, setProducts] = useState(null);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

     // Fetches products from data base
     useEffect(() => {
        fetch('/api/products', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(json => {
                // Products retrieval was successful
                if (json.success) {
                    setProducts(json.products);
                } else {
                    setErrors('Could not retrieve products from database...');
                }
            })
            .catch(err => {
                setErrors('Could not retrieve products from database...');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <Container className={classes.root}>
            <div className={classes.wrapper}>
                <Typography align="center" variant="h4" component="h2">
                    Products
                </Typography>
                {isLoading ? 
                    <div className={classes.largeSpinner}>
                        <CircularProgress size={64} />
                    </div>
                    : products ?
                    <Grid container spacing={3}>
                        {products.map((item, idx) => {
                            return (
                                <Grid item xs={6} md={4} key={idx + item}>
                                    <ProductCard productData={item} key={item._id} />
                                </Grid>
                            );
                        })}
                    </Grid>
                    :
                    <Typography align="center">
                        There are no products available
                    </Typography>
                }
            </div>
        </Container>
    );
}