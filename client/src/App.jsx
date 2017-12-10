import React from 'react';
import { Route } from 'react-router';
import Home from './pages/Home';

const App = () => (
  <div>
    <h1>Welcome Home</h1>
    <Route exact path="/" component={ Home } />
  </div>
);

export default App;
