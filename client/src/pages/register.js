import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Grid, Typography, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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

}));

export default function Register({ updateAuth }) {
  const classes = useStyles();
  // Fetching state
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({});
  const [success, setSuccess] = useState(false);
  // const [redirect, setRedirect] = useState(5);
  // const [loadingUser, setLoadingUser] = useState(false);
  // const [firstNameError, setFirstNameError] = useState('');
  // const [lastNameError, setLastNameError] = useState('');
  // const [username, setUsernameError] = useState('');
  // const [email, setEmailError] = useState('');
  // const [password, setPasswordError] = useState('');

  // const amtOfTime = 5000;
  // function setDelay(startTime) {
  //   var x = setInterval(function () {

  //     // Get current time in ms
  //     var now = new Date().getTime();

  //     // Get the difference between now and startTime
  //     var timeElapsed = now - startTime.getTime();

  //     // Time calculations for seconds
  //     var seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

  //     // Timer
  //     let secondsLeft = Math.max((amtOfTime / 1000) - seconds, 0);

  //     setRedirect(secondsLeft);
  //     // check 5000 ms countdown
  //     // send back to homepage when done counting
  //     if (timeElapsed >= amtOfTime) {
  //       clearInterval(x);
  //     }
  //   }, 1000);
  // }

  // Send post to register user
  async function sendRegisterRequest(e) {
    // Prevent the form from submitting
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

    let localSuccess = false;
    // Send request to register
    fetch('/api/auth/register', {
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
          setSuccess(true);
          localSuccess = true;
        }

        // setDelay(new Date());
        // Save messages
        setMessages(json.messages);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        if (localSuccess) {
          updateAuth(true);
        } else {
          updateAuth(false);
        }
      });
  }

  const deleteMessage = (field) => {
    let msgs = { ...messages };
    msgs[field] = null;
    msgs.general = null;

    setMessages(msgs);
  }

  const register = () => {
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
                  helperText={messages.firstName ? messages.firstName : ''}
                  onFocus={() => deleteMessage('firstName')}
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
                  helperText={messages.lastName ? messages.lastName : ''}
                  onFocus={() => deleteMessage('lastName')}
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
                  error={(messages.username ? true : false)}
                  helperText={messages.username ? messages.username : ''}
                  onFocus={() => deleteMessage('username')}
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
                  helperText={messages.email ? messages.email : ''}
                  onFocus={() => deleteMessage('email')}
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
                  helperText={messages.password ? messages.password : ''}
                  onFocus={() => deleteMessage('password')}
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
                  helperText={messages.password ? messages.password : ''}
                  onFocus={() => deleteMessage('password')}
                />
              </Grid>
            </Grid>
            {messages.general && <p style={{ color: 'red' }}>{messages.general}</p>}
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
                <Link to='/login'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }

  const registerSuccess = () => {
    return (
      <Container>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {messages.general}
            {/* {`You will be redirected to homepage in ${redirect} seconds.`} */}
          </Typography>
        </div>
      </Container>
    );
  }

  //return success ? registerSuccess() : register();
  return success ? registerSuccess() : register();
}