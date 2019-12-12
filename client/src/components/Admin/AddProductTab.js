import React, { useState, useEffect } from 'react';
import { Typography, Container, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Grid, TextField, FormControl, InputLabel, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    users: {
        marginTop: theme.spacing(4),
    },
    wrapper: {
        marginTop: theme.spacing(4)
    }
}));

export default function AddProductTab() {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState();
    const [message, setMessage] = useState();

    async function sendAddProductRequest(e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Set loading state
        setLoading(true);

        let form = e.target;
        let productInfo = {
            name: form.name.value,
            description: form.description.value,
            size: form.size.value,
            price: form.price.value,
            picture: form.picture.value,
        };

        // Send request to register
        fetch('/api/product/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'x-auth-token': JSON.parse(window.localStorage.getItem('user')).token
            },
            body: JSON.stringify(productInfo)
        })
            .then(res => res.json())
            .then(json => {
                // successfully added product
                if (json.success) {
                    // Create product

                    // Save user into local storage upon account creation
                    // Stringify the object
                    // window.localStorage.setItem('product', JSON.stringify(user));
                setMessage('sucessfully added product ' + json.doc.name);
                } else {
                    setMessage(json.messages);
                }
            })
            .catch(err => {

            })
            .finally(() => {
                setLoading(false);
            });
    }
    return (
        <>
            <Typography component="h1" variant="h5">
                This is the add product tab
            </Typography>

            <Container className={classes.users}>
                <form className={classes.form} onSubmit={sendAddProductRequest}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="filled" className={classes.formControl} fullWidth>
                                <InputLabel htmlFor="filled-age-native-simple">Size</InputLabel>
                                <Select
                                    native
                                    // value={state.age}
                                    // onChange={handleChange('age')}
                                    inputProps={{
                                        name: 'size',
                                        id: 'size-select',
                                    }}
                                >
                                    <option value={'none'}>None</option>/>
                                    <option value={'small'}>Small</option>
                                    <option value={'medium'}>Medium</option>
                                    <option value={'large'}>Large</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="price"
                                variant="outlined"
                                required
                                fullWidth
                                id="price"
                                label="Price"
                                type='number'
                                inputProps={{
                                    min: '0'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                variant="outlined"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                multiline
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="picture"
                                label="Picture"
                                name="picture"
                            />
                        </Grid>
                    </Grid>
                    <div className={classes.wrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Add Product
                            </Button>
                    </div>
                </form>
                <Typography>
                    {message}
                </Typography>
            </Container>
        </>
    );
}