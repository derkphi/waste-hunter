import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Catalog from './components/catalog';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/catalog">
          <Catalog />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
      <Link to="/">Login</Link> / <Link to="/catalog">Catalog</Link>
    </Router>
  );
}

export default App;
