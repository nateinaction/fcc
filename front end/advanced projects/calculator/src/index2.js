import { createStore, combineReducers } from 'redux'
import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import { PageHeader, Col, Button, Well, Panel, ListGroup, ListGroupItem, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import './index.scss';

/*
 * Example Object
 */
/*
{
	calculator: {
		value: '44',
		operator: '*',
		total: 220
	}
}
*/

/*
 * Redux Action Creators
 */

const clearCurrent = () => ({
	type: 'CLEAR_CURRENT'
})

const clearAll = () => ({
	type: 'CLEAR_ALL'
})

const addToValue = (value) => ({
	type: 'ADD_TO_VALUE',
	value: value.toString()
})

const changeOperator = (value, operator) => ({
	type: 'CHANGE_OPERATOR',
	value: parseInt(value, 10),
	operator
})

const showTotal = (total) => ({
	type: 'SHOW_TOTAL',
	total: total.toString()
})

/*
 * Redux Reducers
 */

const calculator = (state = {value: '', operator: '', total: 0}, action) => {
	switch (action.type) {
		case 'CLEAR_CURRENT':
			return Object.assign({}, state, {
				value: '',
				operator: ''
	    })
		case 'CLEAR_ALL':
			return Object.assign({}, state, {
				value: '',
				operator: '',
				total: 0
	    })
	  case 'ADD_TO_VALUE':
			return Object.assign({}, state, {
				value: state.value + action.value
	    })
	  case 'CHANGE_OPERATOR':
	  	if (Number.isNaN(action.value)) { // if no current value, allow change of operator
	  		return Object.assign({}, state, {
					operator: action.operator
		    })
	  	} else if (state.total === 0) { // if current value but no total, add current value to total, change the operator and clear current
	  		return Object.assign({}, state, {
	  			value: '',
					operator: action.operator,
					total: action.value
		    })
	  	} else if (state.operator === '+') {
				return Object.assign({}, state, {
	  			value: '',
					operator: '',
					total: state.total + action.value
		    })
			} else if (state.operator === '-') {
				return Object.assign({}, state, {
	  			value: '',
					operator: '',
					total: state.total - action.value
		    })
			} else if (state.operator === '*') {
				return Object.assign({}, state, {
	  			value: '',
					operator: '',
					total: state.total * action.value
		    })
			} else if (state.operator === '/') {
				return Object.assign({}, state, {
	  			value: '',
					operator: '',
					total: state.total / action.value
		    })
			}
			return state
		case 'SHOW_TOTAL':
  		if (state.operator !== '') {
				return Object.assign({}, state, {
	  			value: action.total,
					operator: '',
					total: 0
		    })
			}
			return state
		default:
			return state
	}
}

// I want to write to the total if it is 0 and value holds a value, if I enter a value and then an operator, if I hit the equals sign
const calculatorApp = combineReducers({
	calculator
})

/*
 * Redux Store
 */

let store = createStore(calculatorApp)

/*
 * Redux state to console log
 */

console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))

store.dispatch(changeOperator('','-'))

/*
 * Redux behavior tests
 */
/*
console.log('value = 4')
store.dispatch(addToValue(4))
console.log('value = 42')
store.dispatch(addToValue(2))
console.log('operator = *')
store.dispatch(changeOperator('42','*'))
console.log('operator = /')
store.dispatch(changeOperator('','/'))
console.log('value = 7')
store.dispatch(addToValue(7))
console.log('operator = +')
store.dispatch(changeOperator('7','+'))
console.log('clear current')
store.dispatch(clearCurrent())
console.log('operator = +') // *OK* what happens on change operator when current is empty but total is not?
store.dispatch(changeOperator('','+'))
console.log('value = 9')
store.dispatch(addToValue(9))
console.log('operator = -')
store.dispatch(changeOperator('9','-'))
console.log('value = 9')
store.dispatch(addToValue(9))
//unsubscribe()
*/

/*
 * React Presentational Components
 */

const Header = (props) => (
	<PageHeader>FCC Calculator <small>with React + Redux</small></PageHeader>
)

const ButtonAC = (props) => (
	<Button
		bsStyle='danger'
		block
		onClick={() => props.onClick()} >
		AC
	</Button>
)

const ButtonCE = (props) => (
	<Button
		bsStyle='warning'
		block
		onClick={() => props.onClick()} >
		CE
	</Button>
)

const ButtonEquals = (props) => {
	let total = props.total;
	if (props.operator === '+') {
		total += parseInt(props.value,10)
	} else if (props.operator === '-') {
		total -= parseInt(props.value,10)
	} else if (props.operator === '/') {
		total *= parseInt(props.value,10)
	} else if (props.operator === '/') {
		total /= parseInt(props.value,10)
	} else if (props.operator === '' && props.value !== '') {
		total = parseInt(props.value,10)
	} else if (props.operator === '' && props.value === '') {
		total = 0
	}
	return (
		<Button
			bsStyle='success'
			block
			onClick={() => props.onClick(total)} >
			=
		</Button>
	)
}

const ButtonOperator = (props) => (
	<Button
		bsStyle='info'
		block
		disabled={props.operator !== props.operatorSymbol}
		onClick={() => props.onClick(props.value, props.operatorSymbol)} >
		{props.operatorSymbol}
	</Button>
)

const ButtonNumber = (props) => (
	<Button
		block 
		onClick={() => props.onClick(props.number)} >
		{props.number}
	</Button>
)

const Display = (props) => (
	<Well className='lead text-right'>
		{props.value}
	</Well>
)

const Calculator = (props) => (
	<Col xs={12} md={6} mdOffset={3}>
		<Col xs={12}>
  		<Display value={props.value} />
  	</Col>
  	<Col xs={3}>
  		<ButtonAC onClick={props.handleClearAllClick} />
  		<ButtonNumber number={7} onClick={props.handleAddToValue} />
  		<ButtonNumber number={4} onClick={props.handleAddToValue} />
  		<ButtonNumber number={1} onClick={props.handleAddToValue} />
  		<ButtonNumber number={0} onClick={props.handleAddToValue} />
  	</Col>
  	<Col xs={3}>
  		<ButtonCE onClick={props.handleClearCurrentClick} />
  		<ButtonNumber number={8} onClick={props.handleAddToValue} />
  		<ButtonNumber number={5} onClick={props.handleAddToValue} />
  		<ButtonNumber number={2} onClick={props.handleAddToValue} />
  	</Col>
  	<Col xs={3}>
  		<ButtonEquals value={props.value} operator={props.operator} total={props.total} onClick={props.handleShowTotal} />
  		<ButtonNumber number={9} onClick={props.handleAddToValue} />
  		<ButtonNumber number={6} onClick={props.handleAddToValue} />
  		<ButtonNumber number={3} onClick={props.handleAddToValue} />
  	</Col>
  	<Col xs={3}>
  		<ButtonOperator operatorSymbol='+' operator={props.operator} value={props.value} onClick={props.handleChangeOperator} />
 			<ButtonOperator operatorSymbol='-' operator={props.operator} value={props.value} onClick={props.handleChangeOperator} />
			<ButtonOperator operatorSymbol='*' operator={props.operator} value={props.value} onClick={props.handleChangeOperator} />
			<ButtonOperator operatorSymbol='/' operator={props.operator} value={props.value} onClick={props.handleChangeOperator} />
  	</Col>
  </Col>
)

/*
 * React-Redux Container Components
 */

const mapStateToProps = (state) => ({
	value: state.calculator.value,
	operator: state.calculator.operator,
	total: state.calculator.total
})

const mapDispatchToProps = (dispatch) => ({
	handleClearCurrentClick: () => {
		dispatch(clearCurrent())
	},
	handleClearAllClick: () => {
		dispatch(clearAll())
	},
	handleAddToValue: (value) => {
		dispatch(addToValue(value))
	},
	handleChangeOperator: (value, operator) => {
		dispatch(changeOperator(value, operator))
	},
	handleShowTotal: (total) => {
		dispatch(showTotal(total))
	}
})

const CalculatorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Calculator)


const App = (props) => (
	<div className="App">
	  <Header />
	  <Col xs={12} md={8} mdOffset={2}>
	  	<CalculatorContainer />
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

