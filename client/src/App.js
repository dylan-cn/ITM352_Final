import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import { CssBaseline } from '@material-ui/core';
import Register from './components/register';
import TopNav from './components/topnav';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <TopNav />
      <Router>
        <Switch>
          <Router exact path='/register'>
            <Register />
          </Router>
        </Switch>
      </Router>
    </div >
  );
}

export default App;
