import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { FormControl, InputLabel, Select, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
    },
    paper: {
        position: 'absolute',
        maxWidth: 600,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 4, 3),
        margin: 'auto'
    },
}));

export default function ProductCard({ productData }) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [prices, setPrices] = useState(productData.prices);
    const [size, setSize] = useState(Object.keys(prices)[0]);

    const handleModal = () => {
        setOpen(prevState => !prevState);
    }

    const handleSelectSize = (e) => {
        console.log(e.target.value)
        setSize(e.target.value);
    }

    const addToCart = (e) => {
        e.preventDefault();
        const currCart = JSON.parse(window.localStorage.getItem('cart'));
        const quantity = e.target.quantity.value;
        const price = prices[size];

        if (currCart) {
            const newCart = [
                ...currCart,
                {
                    name: productData.name,
                    price,
                    size,
                    quantity
                }
            ];

            window.localStorage.setItem('cart', JSON.stringify(newCart));
        } else {
            const newCart = [];
            newCart.push(
                {
                    name: productData.name,
                    price,
                    size,
                    quantity
                }
            );

            window.localStorage.setItem('cart', JSON.stringify(newCart));
        }
    }

    return (
        <>
            <Card className={classes.card}>
                <CardActionArea onClick={handleModal}>
                    <CardMedia
                        component="img"
                        alt={productData.name}
                        //height="140"
                        image={productData.picture}
                        title={productData.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {productData.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {productData.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleModal}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                elevation={0}
            >
                <div className={classes.paper}>
                    <Card>
                        <CardMedia
                            component="img"
                            alt={productData.name}
                            image={productData.picture}
                            title={productData.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {productData.name}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                {productData.description}
                            </Typography>

                            <form onSubmit={addToCart}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl variant="filled" className={classes.formControl} fullWidth>
                                            <InputLabel htmlFor="filled-age-native-simple">Size</InputLabel>
                                            <Select
                                                native
                                                // value={state.age}
                                                onChange={handleSelectSize}
                                                inputProps={{
                                                    name: 'size',
                                                    id: 'size-select',
                                                }}
                                                style={{ maxWidth: 200 }}
                                            >
                                                {Object.entries(productData.prices).map(([key, value]) => {
                                                    return (
                                                        <option value={key} key={key + value}>{key}</option>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6} style={{ margin: 'auto' }}>
                                        <Typography>
                                            Price: ${prices[size]}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="quantity"
                                            label="Quantity"
                                            name="quantity"
                                            autoComplete="quantity"
                                            inputProps={{
                                                type: 'number',
                                                min: '1',
                                            }}
                                        />
                                    </Grid>


                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit">
                                        Add to cart
                                    </Button>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Modal>
        </>
    );
}