import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Catalog from './components/catalog';
import Cleanup from './screens/cleanup';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/cleanup">
          <Cleanup />
        </Route>
        <Route path="/catalog">
          <Catalog />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
      <Link to="/">Login</Link> / <Link to="/catalog">Catalog</Link> / <Link to="/cleanup">Cleanup</Link>
    </Router>
  );
}

export default App;
