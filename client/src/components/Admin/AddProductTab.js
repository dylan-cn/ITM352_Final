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

    useEffect(() => {
        setLoading(true);
        const user = JSON.parse(window.localStorage.getItem('user'));
        // Send request to register
        fetch('/api/users', {
            method: 'GET',
            headers: {
                'x-auth-token': user.token
            },
        })
            .then(res => res.json())
            .then(json => {
                // Registration was a success
                if (json.success) {
                    setUsers(json.users);
                } else {
                    setErrors('Could not retrieve users from database...');
                }
            })
            .catch(err => {
                setErrors('Could not retrieve users from database...');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Typography component="h1" variant="h5">
                This is the add product tab
            </Typography>

            <Container className={classes.users}>
                <form className={classes.form} noValidate>
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
            </Container>
        </>
    );
}

function UserRow({ userInfo }) {
    const [user, setUser] = useState({ ...userInfo });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState();

    const setRank = (rank) => (event) => {
        setLoading(true);
        const userData = JSON.parse(window.localStorage.getItem('user'));

        //Send request to update document
        fetch('/api/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': userData.token
            },
            body: JSON.stringify({ _id: user._id, role: rank })
        })
            .then(res => res.json())
            .then(json => {
                // Registration was a success
                if (json.success) {
                    setUser(json.user);
                } else {
                    setErrors('Could not update record');
                }
            })
            .catch(err => {
                setErrors('Database error');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <TableRow key={user._id}>
            <TableCell component="th" scope="row">
                {user.username}
            </TableCell>
            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell align="center">
                {loading && <CircularProgress size={24} />}

                {user.role === 'user' && !loading &&
                    <Button variant="contained" color="secondary" onClick={setRank('admin')}>
                        Promote
                    </Button>
                }

                {user.role === 'admin' && !loading &&
                    <Button variant="contained" color="primary" onClick={setRank('user')}>
                        Demote
                    </Button>
                }
            </TableCell>
        </TableRow>
    );
}