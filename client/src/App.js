import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <form method="POST" action='/api/users/register'>
          <input type="text" name="firstName"></input>
          <input type="text" name="lastName"></input>
          <input type="text" name="username"></input>
          <input type="text" name="password"></input>
          <input type="text" name="passwordConfirm"></input>
          <input type="text" name="email"></input>

          <input type="submit"></input>
        </form>

        <br />

        <form method="POST" action='/api/auth'>
          <input type="text" name="username"></input>
          <input type="text" name="password"></input>
          <input type="submit"></input>
        </form>
      </header>
    </div>
  );
}

export default App;
