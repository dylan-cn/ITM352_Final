import React, { useState, useEffect } from 'react';
import { Typography, Container, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Paper, InputBase } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

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

export default function UserTab() {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState();
    const [searchInput, setSearchInput] = useState(null);

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

    function handleSearchChange(e) {
        setSearchInput(e.target.value);
    }

    return (
        <>
            <Typography align="center" component="h1" variant="h5">
                This is the user management tab
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
                                        <TableCell align="center">Username</TableCell>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Role</TableCell>
                                        <TableCell align="center">Promote to Admin</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users
                                        .filter(elem => { 
                                            if (searchInput && searchInput.trim().length > 0) {
                                                return elem.username.toUpperCase().startsWith(searchInput.toUpperCase());
                                            } else {
                                                return true;
                                            }
                                        })
                                        .map(user => (
                                        <UserRow key={user._id} userInfo={user} />
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
            <TableCell align="center">{user.username}</TableCell>
            <TableCell align="center">{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell align="center">{user.role}</TableCell>
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