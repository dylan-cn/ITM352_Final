import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        overflowX: 'auto',
        width: '100%',
    },
    floatedRight: {
        float: 'right',
    }
}));

export default function Cart() {
    const classes = useStyles();

    const defaultCart = JSON.parse(window.localStorage.getItem('cart'));
    const [cart, setCart] = useState(defaultCart ? defaultCart.cart : null);

    let subtotal = 0;
    let tax = 0;

    // Remove an item from the cart
    const handleRemove = (item) => {
        const currCart = JSON.parse(window.localStorage.getItem('cart'));
        let newCart = currCart.cart.filter(product => {
            return product.name !== item.name;
        })

        // Reset cart if everything is removed from cart
        if (newCart.length === 0) {
            window.localStorage.removeItem('cart');
            setCart(null);
        } else {
            window.localStorage.setItem('cart', JSON.stringify({ ...currCart, cart: newCart }));
            setCart(JSON.parse(window.localStorage.getItem('cart')).cart);
        }
    }

    return (
        <Container>
            {cart && cart.length > 0 ?
                <>
                    <div className={classes.root}>
                        <Table className={classes.table} aria-label="cart table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Size</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Qty</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.map(item => {
                                    const itemSub = +item.price * +item.quantity;
                                    subtotal += itemSub;
                                    tax += (+itemSub * 0.04712);

                                    return (
                                        <TableRow key={item.name + item.price}>
                                            <TableCell component="th" scope="row">
                                                {item.name}
                                            </TableCell>
                                            <TableCell align="right">{item.size}</TableCell>
                                            <TableCell align="right">{item.price}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">${(+item.price * + item.quantity).toFixed(2)}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="button"
                                                    onClick={() => handleRemove(item)}
                                                >
                                                    X
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>

                        <br />

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">Subtotal</TableCell>
                                    <TableCell align="left">${(subtotal).toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">Tax @ 4.712%</TableCell>
                                    <TableCell align="left">${(tax).toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right"><strong>Total</strong></TableCell>
                                    <TableCell align="left"><strong>${(+subtotal + +tax).toFixed(2)}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <br />

                    </div>

                    <Typography align="center">
                        ** Credit card only **
                    </Typography>

                    <Button variant="contained" style={{ float: 'right' }} component={Link} to='/checkout'>
                        Check Out
                    </Button>
                </>

                :
                <Typography align="center" component="h1" variant="h5">
                    No items in cart
                </Typography>
            }
        </Container>
    );
}
