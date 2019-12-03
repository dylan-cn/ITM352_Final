import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { CssBaseline, CircularProgress, Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { PrivateRoute } from './helper/PrivateRoute';
import { LoggedInRoute } from './helper/LoggedInRoute';
import Register from './pages/register';
import TopNav from './components/topnav';
import Test from './pages/test';
import Login from './pages/login';
import Home from './pages/home';
import { AuthProvider } from './context/AuthContext';


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
      loadingUser: true,
      user: {}
    }
  }

  // try to authenticate the user on app start
  processUser = () => {
    const getUser = window.localStorage.getItem('user');
    const user = JSON.parse(getUser);
    if (user !== null) {
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
            this.setState({ auth: true });
            this.setState({
              user: {
                ...user
              }
            });
          } else {
            window.localStorage.removeItem('user');
            this.setState({ auth: false });
            this.setState({ user: {} });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loadingUser: false });
        })

    } else {
      this.setState({ auth: false });
      this.setState({ loadingUser: false });
    }
  }

  // Verify the user on mount
  componentDidMount() {
    this.setState({ loadingUser: true });
    // simulate a long request
    setTimeout(() => {
      this.processUser();
    }, 1000);
  }

  // Allow child components to update auth status
  updateAuth = (status) => {
    const getUser = window.localStorage.getItem('user');
    const user = JSON.parse(getUser);
    this.setState({ auth: status });
    this.setState({
      user: {
        ...user
      }
    });
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
        <AuthProvider>
          <Router>
            <TopNav isAuth={this.state.auth} user={this.state.user} updateAuth={this.updateAuth} />
            <Switch>
              <PrivateRoute path={"/test"} component={Test} isAuthenticated={this.state.auth} isLoading={this.state.loadingUser} />
              <LoggedInRoute exact path='/register' display={!this.state.auth && !this.state.loadingUser} isAuthenticated={this.state.auth} updateAuth={this.updateAuth} component={Register} />
              <LoggedInRoute exact path='/login' display={!this.state.auth && !this.state.loadingUser} isAuthenticated={this.state.auth} updateAuth={this.updateAuth} component={Login} />
              <Route exact path='/' component={Home} />
            </Switch>
          </Router>
        </AuthProvider>
      </div >
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(App);
