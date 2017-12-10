import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
// import reducers from '../../client/src/reducers/index';
import App from '../../client/src/App';

const router = express.Router();

router.get('/', (req, res) => {
  /*
    http://redux.js.org/docs/recipes/ServerRendering.html
  */
  const store = createStore(() => {});

  /*
    Can also dispatch here to pre-populate the store
  */

  const context = {};

  const render = (Component) => {
    ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.originalUrl}
          context={context}
        >
          <Component />
        </StaticRouter>
      </Provider>,
    );
  };

  const finalState = store.getState();

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    res.status(200).render('../views/index.ejs', {
      html: render(App),
      initialReduxState: JSON.stringify(finalState),
    });
  }
});

export default router;
