import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux';
// import reducers from './reducers/index';
import Home from './pages/Home';

const store = createStore();

const App = () => (
  <div>
    Testing!
    <Route exact path="/" component={ Home } />
  </div>
);

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('reactbody'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    // eslint-disable-next-line
    render(App);
  });
}

