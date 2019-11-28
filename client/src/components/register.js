import React, { useState } from 'react';
import { Button, TextField, Link, Grid, Typography, Container, CircularProgress, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
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

}));

export default function Register() {
  const classes = useStyles();
  // Fetching state
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({});
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [username, setUsernameError] = useState('');
  const [email, setEmailError] = useState('');
  const [password, setPasswordError] = useState('');

  // Send post to register user
  async function sendRegisterRequest(e) {
    // Prevent the form form submitting
    e.preventDefault();

    // Set loading state
    setIsLoading(true);

    let form = e.target;
    let userInfo = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      passwordConfirm: form.passwordConfirm.value
    };

    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {

        }
        console.log(json);
        setMessages(json.messages);
      })
      .catch(err => {

      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function stall(stallTime = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={sendRegisterRequest}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={(messages.firstName ? true : false)}
                helperText = {messages.firstName ? messages.firstName : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={(messages.lastName ? true : false)}
                helperText = {messages.lastName ? messages.lastName : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                error={(messages.userName ? true : false)}
                helperText = {messages.userName ? messages.userName : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={(messages.email ? true : false)}
                helperText = {messages.email ? messages.email : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={(messages.password ? true : false)}
                helperText = {messages.password ? messages.password : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordConfirm"
                label="Retype Password"
                type="password"
                id="passwordConfirm"
                autoComplete="current-password"
                error={(messages.password ? true : false)}
                helperText = {messages.password ? messages.password : ''}
              />
            </Grid>
          </Grid>
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              className={classes.submit}
            >
              Sign Up
          </Button>
            {isLoading &&
              <div className={classes.spinner}>
                <CircularProgress size={24} />
              </div>}
          </div>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}