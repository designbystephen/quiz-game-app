import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux';
// import reducers from './reducers/index';
import App from './App';

const store = createStore(() => {});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('react-app'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    // eslint-disable-next-line
    render(App);
  });
}
