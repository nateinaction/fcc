import { createStore, combineReducers } from 'redux'
import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import uuidV4 from 'uuid/v4';
import { PageHeader, Col, Button, ButtonToolbar, Well, Panel, ListGroup, ListGroupItem, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import './index.scss';

/*
 * Redux Action Creators
 */


/*
 * Redux Reducers
 */



/*
 * Redux Store
 */

let store = createStore(gameOfLifeApp)

/*
 * React Presentational Components
 */



/*
 * React-Redux Container Components
 */



/*
 * React Root Component
 */



/*
 * React Dom
 */

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
