import React from 'react';
import { Route } from 'react-router';
import Home from './pages/Home';
import './styles/globals/base.scss';

const App = () => (
  <Route exact path="/" component={Home} />
);

export default App;
