import React, { useState, useEffect } from 'react';
import { Typography, Container, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Paper, InputBase } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

// CSS styling for components 
const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    users: {
        marginTop: theme.spacing(4),
        width: '100%',
        overflowX: 'auto',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
}));

// User table container
export default function DeleteProduct() {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState();
    const [searchInput, setSearchInput] = useState(null);

    // Fetches users from data base
    useEffect(() => {
        setLoading(true);
        const user = JSON.parse(window.localStorage.getItem('user'));
        // Send request to register
        fetch('/api/products', {
            method: 'GET',
            headers: {
                'x-auth-token': user.token
            },
        })
            .then(res => res.json())
            .then(json => {
                // Registration was a success
                if (json.success) {
                    console.log(json.products);
                    setProducts(json.products);
                } else {
                    setErrors('Could not retrieve products from database...');
                }
            })
            .catch(err => {
                setErrors('Could not retrieve products from database...');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Sets date for search queries 
    function handleSearchChange(e) {
        setSearchInput(e.target.value);
    }

    // returns the user tab component 
    return (
        <>
            <Typography align="center" component="h1" variant="h5">
                Delete Products
            </Typography>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearchChange}
                />
            </div>
            <Paper className={classes.users}>
                {loading ? <Typography align="center">Loading...</Typography>
                    : !errors ?
                        <Container>
                            <Table aria-label="users table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products &&
                                        products
                                            .filter(elem => {
                                                if (searchInput && searchInput.trim().length > 0) {
                                                    return elem.name.toUpperCase().includes(searchInput.toUpperCase());
                                                } else {
                                                    return true;
                                                }
                                            })
                                            .map(product => (
                                                <ProductRow key={product._id} productInfo={product} setProducts={setProducts} />
                                            ))}
                                </TableBody>
                            </Table>
                        </Container>
                        :
                        <Typography align="center">{errors}</Typography>
                }
            </Paper>
        </>
    );
}

// Compenent to create the a user row in the user table 
function ProductRow({ productInfo }) {
    const [product] = useState({ ...productInfo });
    const [deleted, setDeleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState();

    // Function to allow promotion or demotion of user
    const deleteProduct = (id) => (event) => {
        setLoading(true);
        const userData = JSON.parse(window.localStorage.getItem('user'));

        //Send request to update document
        fetch('/api/product', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': userData.token
            },
            body: JSON.stringify({
                productId: id,
                picture: productInfo.picture
            })
        })
            .then(res => res.json())
            .then(json => {
                // Deletion was success
                if (json.success) {
                    setDeleted(true);
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

    // Compenent to return user row
    return (
        <TableRow key={product._id}>
            <TableCell align="center">{product.name}</TableCell>
            <TableCell align="center">
                {loading && <CircularProgress size={24} />}

                {!loading && !deleted &&
                    <Button variant="contained" color="secondary" onClick={deleteProduct(product._id)}>
                        Delete
                    </Button>
                }

                {!loading && deleted &&
                    <Typography>
                        <strong>
                            Deleted
                        </strong>
                    </Typography>
                }
            </TableCell>
        </TableRow>
    );
}