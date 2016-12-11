import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import axios from 'axios';
import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux'
import { PageHeader, Col, Button, ListGroup, ListGroupItem, FormGroup, ControlLabel, FormControl, InputGroup } from 'react-bootstrap';
import './index.scss';

/*
{
	searchField: '',
	results: {
		isFetching = 'false',
		articles: [{
			title: '',
			description: '',
			link: ''
		}],
	error: {
		display: false,
		message: 'blah'
	}
}
*/

/*
 * Redux Action Creators
 */

const modifySearch = (input) => ({
	type: 'MODIFY',
	input
})

const submitSearch = () => ({
	type: 'SUBMIT'
})

const receiveResults = (articles) => ({
	type: 'RECEIVE',
	articles
})

const fetchArticles = (input) => {
	let url = 'https://en.wikipedia.org/w/api.php'
	let axiosConfig = {
		params: {
			action: 'query',
			format: 'json',
			origin: '*',
			list: 'search',
			srsearch: input
		}
	}
  return dispatch => {
    dispatch(submitSearch())
    return axios.get(url, axiosConfig)
			.then(response => dispatch(receiveResults(response.data.query.search)))
		  .catch(error => {
		  	console.log(error)
		  });
  }
}

/*
 * Redux Reducers
 */

const searchField = (state = '', action) => {
	switch (action.type) {
		case 'MODIFY':
			return action.input
		default:
			return state
	}
}

const results = (state = {isFetching: false, articles: []}, action) => {
	switch (action.type) {
		case 'SUBMIT':
			return Object.assign({}, state, {
				isFetching: true
	    })
		case 'RECEIVE':
			return Object.assign({}, state, {
				isFetching: false,
				articles: action.articles
	    })
		default:
			return state
	}
}

const wikipediaViewer = combineReducers({
	searchField,
	results
})

/*
 * Redux Store
 */

let store = createStore(wikipediaViewer, applyMiddleware(
	thunkMiddleware
))

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
console.log('type in search field')
store.dispatch(modifySearch('test'))
console.log('clear search field')
store.dispatch(clear())
console.log('fetch results')
store.dispatch(fetchArticles('Apples and oranges'))
	.then(() => console.log(store.getState()))
	.then(() => console.log('clear search field and results'))
	.then(() => store.dispatch(clear()))
unsubscribe()
*/

/*
 * React Presentational Components
 */

const Header = (props) => (
	<PageHeader>Wikipedia Viewer <small>with React & Redux</small></PageHeader>
)

const SearchButton = (props) => (
		<Button
			bsStyle='primary'
			onClick={() => {
				return props.onFetchArticles(props.searchField)
			}}>
			Search
		</Button>
)
SearchButton.proptypes = {
	onFetchArticles: PropTypes.func.isRequired,
	searchField: PropTypes.string.isRequired
}

const RandomButton = (props) => (
	<Button
		target='_blank'
		href='https://en.wikipedia.org/wiki/Special:Random'>
		Random
	</Button>
)

const SearchBar = (props) => (
	<form
		onSubmit={(e) => {
			e.preventDefault()
			return props.handleFetchArticles(props.searchField)
		}}>
		<FormGroup controlId='Search'>
			<ControlLabel>Search</ControlLabel>
			<InputGroup>
		    <FormControl
		    	onChange={(e) => {
		    		e.preventDefault()
		    		return props.handleModifySearch(e.target.value)
		    	}}
		    	type='textarea'
		    	placeholder='Search...' />
		    <InputGroup.Button>
		    	<SearchButton searchField={props.searchField} onFetchArticles={props.handleFetchArticles} />
		    	<RandomButton />
	  		</InputGroup.Button>
			</InputGroup>
	  </FormGroup>
  </form>
)
SearchBar.proptypes = {
	handleModifySearch: PropTypes.func.isRequired,
	handleFetchArticles: PropTypes.func.isRequired,
	searchField: PropTypes.string.isRequired
}

const ArticleList = (props) => (
	<ListGroup>
	{props.results.articles.map((article, index) => {
		let encodedTitle = encodeURIComponent(article.title)
		return (
			<ListGroupItem
				key={index}
				target='_blank'
				header={article.title}
				href={'https://www.wikipedia.org/wiki/' + encodedTitle}>
				<span dangerouslySetInnerHTML={{__html: article.snippet}} />
			</ListGroupItem>
	)})}
	</ListGroup>
)
ArticleList.proptypes = {
	results: PropTypes.obj,
}

/*
 * React-Redux Container Components
 */

const mapStateToProps = (state) => ({
	searchField: state.searchField
})

const mapDispatchToProps = (dispatch) => ({
	handleModifySearch: (input) => {
	dispatch(modifySearch(input))
	},
	handleFetchArticles: (input) => {
		dispatch(fetchArticles(input))
	}
})

const SearchBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchBar)

const mapStateToPropsTwo = (state) => ({
	results: state.results
})

const ArticleListContainer = connect(
	mapStateToPropsTwo
)(ArticleList)


/*
 * React Root Component
 */

const App = (props) => (
	<div className="App">
	  <Header />
	  <Col xs={12} md={8} mdOffset={2}>
	  	<SearchBarContainer />
	  	<ArticleListContainer />
	  </Col>
  </div>
)

/*
 * React Dom
 */

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
