import React from 'react';
import { Route } from 'react-router';
import Home from './pages/Home';
import './styles/globals/base.scss';

const App = () => (
  <div>
    <Route exact path="/" component={Home} />
  </div>
);

export default App;
