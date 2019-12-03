import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, TextField, Grid, Typography, Container, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    spinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loggedIn: false
        };

        this.sendLoginRequest = this.sendLoginRequest.bind(this);
    }

    // Send post to login user
    async sendLoginRequest(e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Set loading state
        this.setState({ isLoading: true });

        let form = e.target;
        let userInfo = {
            username: form.username.value,
            password: form.password.value,
        };

        // Send request to register
        fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
            .then(res => res.json())
            .then(json => {
                // Registration was a success
                if (json.success) {
                    // Create user to be added to local storage
                    const user = {
                        ...json.user,
                        token: json.token
                    };

                    // Save user into local storage upon account creation
                    // Stringify the object
                    window.localStorage.setItem('user', JSON.stringify(user));
                    this.setState({ loggedIn: true });

                }
            })
            .catch(err => {

            })
            .finally(() => {
                this.setState({ isLoading: false });

                if (this.state.loggedIn) {
                    this.props.updateAuth(true);
                } else {
                    this.props.updateAuth(false);
                }
            });
    }

    render() {
        const { classes } = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        if (this.state.loggedIn && !this.state.isLoading) {
            return <Redirect to={from} />
        }

        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.sendLoginRequest}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    name="password"
                                    autoComplete="password"
                                    type="password"
                                />
                            </Grid>
                        </Grid>
                        <div className={classes.wrapper}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={this.state.isLoading}
                                className={classes.submit}
                            >
                                Login
                        </Button>
                            {this.state.isLoading &&
                                <div className={classes.spinner}>
                                    <CircularProgress size={24} />
                                </div>}
                        </div>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link to='/register'>
                                    Don't have an account? Register
                            </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        )
    };
}

export default withStyles(useStyles, { withTheme: true })(Login);