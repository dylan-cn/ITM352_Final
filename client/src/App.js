import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { CssBaseline, CircularProgress, Container } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { PrivateRoute } from './helper/PrivateRoute';
import { LoggedInRoute } from './helper/LoggedInRoute';
import { AdminRoute } from './helper/AdminRoute';
import Register from './pages/register';
import TopNav from './components/topnav';
import Login from './pages/login';
import Home from './pages/home';
import { AuthProvider } from './context/AuthContext';
import { blue } from '@material-ui/core/colors';
import UserTab from './components/Admin/UserTab';
import AddProductTab from './components/Admin/AddProductTab';
import NotFound from './pages/NotFound';
import ProductsHome from './pages/ProductsHome';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ManageOrders from './pages/ManageOrders';
import MyOrders from './pages/MyOrders';
import DeleteProduct from './pages/DeleteProduct';


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
  footer: {
    marginTop: theme.spacing(8),
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000'
    },
    secondary: blue,
    type: 'light',
  },
  status: {
    danger: 'orange',
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
            this.setState({
              auth: true,
              user: {
                ...user
              }
            });
          } else {
            window.localStorage.removeItem('user');
            this.setState({
              auth: false,
              user: {}
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loadingUser: false });
        })

    } else {
      this.setState({
        auth: false,
        loadingUser: false
      });
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
    this.setState({
      auth: status,
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
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <Router>
            <TopNav isAuth={this.state.auth} user={this.state.user} updateAuth={this.updateAuth} />
            <Switch>
              <AdminRoute exact path='/admin/users' component={UserTab} isAuthenticated={this.state.auth} role={this.state.user.role} />
              <AdminRoute exact path='/admin/addproduct' component={AddProductTab} isAuthenticated={this.state.auth} role={this.state.user.role} />
              <AdminRoute exact path='/admin/deleteproduct' component={DeleteProduct} isAuthenticated={this.state.auth} role={this.state.user.role} />
              <AdminRoute exact path='/admin/orders' component={ManageOrders} isAuthenticated={this.state.auth} role={this.state.user.role} />
              <LoggedInRoute exact path='/register' isAuthenticated={this.state.auth} updateAuth={this.updateAuth} component={Register} />
              <LoggedInRoute exact path='/login' isAuthenticated={this.state.auth} updateAuth={this.updateAuth} component={Login} />
              <PrivateRoute exact path='/checkout' isAuthenticated={this.state.auth} component={Checkout} />
              <PrivateRoute exact path='/cart' isAuthenticated={this.state.auth} component={Cart} />
              <PrivateRoute exact path='/myorders' isAuthenticated={this.state.auth} component={MyOrders} />
              <Route exact path='/products' component={ProductsHome} />
              <Route exact path='/' component={Home} />
              <Route component={NotFound} />
            </Switch>
            <div className={classes.footer}>

            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(App);
