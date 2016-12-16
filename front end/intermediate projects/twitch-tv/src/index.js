import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import fetch, { dns } from 'fetch';
import fetchJsonp from 'fetch-jsonp';

//import React, { PropTypes } from 'react';
//import { render } from 'react-dom';
//import { Provider, connect } from 'react-redux'
import './index.scss';
//import { PageHeader, Col, ListGroup, ListItem } from 'react-bootstrap';

/*
 * Example Redux Object
 */

/*
{
  users: [{
    name: 'nateinaction',
    online: true
  }]
}
*/

/*
 * Redux Action Creators
 */

const setOnline = (user) => ({
  type: 'SET_ONLINE',
  user
})

const addUser = (user, online) => ({
  type: 'ADD_USER',
  user,
  online
})

const setOffline = (user) => ({
  type: 'SET_OFFLINE',
  user
})


let url = 'https://wind-bow.gomix.me/twitch-api/streams/freecodecamp'
fetchJsonp(url)
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })


/*
 * Redux Reducers
 */

const users = (state = [], action) => {
	switch (action.type) {
		case 'ADD_USER':
			return [...state, {
			  user: action.user,
			  online: action.online
			}]
		case 'SET_ONLINE':
			return state.map((user) => {
			  Object.assign({}, user, {
 				  online: true
			  })
      })
    case 'SET_OFFLINE':
			return state.map((user) => {
			  Object.assign({}, user, {
 				  offline: true
			  })
      })
		default:
			return state
	}
}

const twitchTvApp = combineReducers({
	users
})

/*
 * Redux Store
 */

let store = createStore(twitchTvApp)

/*
 * Redux state to console log
 */

/*
console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))
*/

/*
 * Redux behavior tests
 */

/*
console.log('dispatch')
store.dispatch(modifySearch('test'))
console.log('async dispatch')
store.dispatch(fetchArticles('Apples and oranges'))
	.then(() => console.log(store.getState()))
	.then(() => console.log('clear search field and results'))
	.then(() => store.dispatch(clear()))
unsubscribe()
*/

/*
 * React Presentational Components
 */
/*
const Header = (props) => (
	<PageHeader>FCC Twitch TV <small>with React and Redux</small></PageHeader>
)

const UserContainer = (props) => (
	<ListItem header={props.name}>
	  test
	</ListItem>
)
UserContainer.propTypes = {
	user: PropTypes.obj.isRequired
}

const StreamList = (props) => (
	<ListGroup>
	  {props.users.map((user, index) => (
	    <UserContainer
	      key={index}
	      name={user.name} />
	  ))}
	</ListGroup>
)
StreamList.propTypes = {
	users: PropTypes.obj.isRequired
}
*/
/*
 * React-Redux Container Components
 */



/*
 * React Root Component
 */
/*
const exampleData = [{
  user: {
    name: 'nateinaction',
    stream: null,
    link: 'https://nategay.me/'
  }
}]

const App = (props) => (
	<div className="App">
    <Header />
    <Col xs={12} md={4} mdOffset={4}>
	  	<StreamList users={exampleData} />
	  </Col>
  </div>
)
*/
/*
 * React Dom
 */
/*
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
*/