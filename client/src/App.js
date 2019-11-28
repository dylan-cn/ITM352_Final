import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { CssBaseline } from '@material-ui/core';
import { PrivateRoute } from './helper/PrivateRoute';
import { LoggedInRoute } from './helper/LoggedInRoute';
import Register from './components/register';
import TopNav from './components/topnav';
import Test from './components/test';
import Login from './components/login';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Container } from '@material-ui/core';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeSpinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -32,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: false,
      loadingUser: false
    }
  }

  // try to authenticate the user on app start
  processUser = () => {
    console.log("trying to verify user");
    const getUser = window.localStorage.getItem('user');
    const user = JSON.parse(getUser);
    if (user !== null) {
      this.setState({ loadingUser: true });

      setTimeout(() => {
        // Send request to verify token
        fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'x-auth-token': user.token
          },
        })
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              console.log("verified user");
              this.setState({ auth: true });
            } else {
              window.localStorage.removeItem('user');
              this.setState({ auth: false });
            }

            console.log("not loading user");
            this.setState({ loadingUser: false });
          })
          .catch(err => {
            console.log(err);
          })
      }, 1000);
    }
  }

  componentDidMount() {
    this.processUser();
  }

  render() {
    const { classes } = this.props;

    if (this.state.loadingUser) {
      return (
        <Container className={classes.paper}>
          <div className={classes.largeSpinner}>
            <CircularProgress size={64} />
          </div>
        </Container>
      );
    }

    return (
      <div className="App" >
        <CssBaseline />
        <TopNav />
        <Router>
          <Switch>
            {this.state.auth ? <PrivateRoute exact path='/test' isAuth={this.state.auth} component={Test} /> : null}
            <LoggedInRoute exact path='/register' isAuth={this.state.auth} component={Register} />
            <LoggedInRoute exact path='/login' isAuth={this.state.auth} component={Login} />
          </Switch>
        </Router>
      </div >
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(App);
