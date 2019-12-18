import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, CircularProgress, Typography, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

    const [cart, setCart] = useState(JSON.parse(window.localStorage.getItem('cart')));

    let subtotal = 0;
    let tax = 0;
    let total = 0;

    return (
        <Container>
            {cart ?
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
                                            <TableCell align="right">{+item.price * + item.quantity}</TableCell>
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

                    <Button variant="contained" style={{ float: 'right' }} component={Link} to='/checkout'>
                        Check Out
                    </Button>
                </>

                :
                <Typography align="center">
                    No items in cart
                </Typography>
            }
        </Container>
    );
}
