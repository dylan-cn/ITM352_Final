import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { FormControl, InputLabel, Select } from '@material-ui/core';

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
    const [prices] = useState(productData.prices);
    const [size, setSize] = useState(Object.keys(prices)[0]);

    // Set open or close state for product modal
    const handleModal = () => {
        setOpen(prevState => !prevState);
    }

    // Changes sizes and prices
    const handleSelectSize = (e) => {
        setSize(e.target.value);
    }

    // Alert the user if adding item to cart was successful or not
    const sendCartMessage = (item, success) => {
        if (success) {
            alert(`Added ${item.quantity} ${item.name} to cart`);
            handleModal();
        } else {
            alert(`Could not add ${item.quantity} ${item.name} to cart`);
        }
    }

    // Add item to cart
    // Localstorage
    const addToCart = (e) => {
        // prevent the form from submitting
        e.preventDefault();

        const temp = JSON.parse(window.localStorage.getItem('cart'));
        const currCart = temp ? temp.cart : null;
        const quantity = e.target.quantity.value;
        const price = prices[size];
        const picture = productData.picture;

        const newItem = {
            name: productData.name,
            price,
            size,
            quantity,
            picture,
            options: null
        };

        if (currCart) {
            if (temp.type.toLowerCase() === 'catering' && productData.category !== 'catering') {
                alert('You cannot mix catering items with non-catering items');
                return;
            }

            if (temp.type.toLowerCase() !== 'catering' && productData.category === 'catering') {
                alert('You cannot mix catering items with non-catering items');
                return;
            }

            // If already have a cart, check for duplicate items
            const findDup = currCart.findIndex(item => {
                return item.name === newItem.name && item.size === newItem.size && item.options == newItem.options;
            });

            // item already exists in cart
            // edit existing
            let newCart = [];
            if (findDup !== -1) {
                currCart[findDup] = {
                    ...currCart[findDup],
                    quantity: +currCart[findDup].quantity + +newItem.quantity
                }

                newCart = [
                    ...currCart
                ];
            } else {
                // Item does not exist in cart, so just append to array
                newCart = [
                    ...currCart,
                    newItem
                ];
            }

            // set the cart in localstorage
            const tempCart = JSON.parse(window.localStorage.getItem('cart'));
            window.localStorage.setItem('cart', JSON.stringify({ ...tempCart, cart: newCart }));

            sendCartMessage(newItem, true);
        } else {
            // Create new cart
            const newCart = [];
            newCart.push(
                {
                    name: productData.name,
                    price,
                    size,
                    quantity,
                    picture
                }
            );

            const type = productData.category.toLowerCase() === 'catering' ? 'catering' : 'all';

            // set cart in localstorage, assign type of cart
            window.localStorage.setItem('cart', JSON.stringify({ type, cart: newCart }));

            sendCartMessage(newItem, true);
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
                                    <Grid item xs={6}>
                                        <FormControl variant="filled" className={classes.formControl} fullWidth>
                                            <InputLabel htmlFor="size-select">Size</InputLabel>
                                            <Select
                                                native
                                                // value={state.age}
                                                onChange={handleSelectSize}
                                                inputProps={{
                                                    name: 'size',
                                                    id: 'size-select',
                                                }}
                                                style={{ height: 50 }}
                                            >
                                                {Object.entries(productData.prices).map(([key, value]) => {
                                                    return (
                                                        <option value={key} key={key + value}>{key}</option>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>

                                        <Typography variant="h6" component="h6">
                                            Price: ${prices[size]}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
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

                                        <Button variant="contained" fullWidth color="primary" type="submit">
                                            Add to cart
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Modal>
        </>
    );
}