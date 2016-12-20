import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import { PageHeader, Col, Button, Well } from 'react-bootstrap';
import './index.scss';

/*
 * Example Object
 */
/*
{
	play: true,
	visibleTimer: 'pomodoro', // or 'shortBreak' or 'longBreak'
	timeRemaining: 24,
	pomodoro: {
		timeSet: 42 // (in minutes)
	},
	shortBreak: {
		timeSet: 13
	},
	longBreak: {
		timeSet: 13
	}
}
*/

/*
 * Redux Action Creators
 */

const allClear = () => ({
	type: 'ALL_CLEAR'
})

const clearEntry = () => ({
	type: 'CLEAR_ENTRY'
})

const setOperation = (operation) => ({
	type: 'SET_OPERATION',
	operation
})

const setEntry = (entry) => ({
	type: 'SET_ENTRY',
	entry
})

const appendToEntry = (input) => {
	return (dispatch, getState) => {
    const state = getState()
    let entry = state.entry
    entry += input.toString()
		entry = parseInt(entry, 10)
		return dispatch(setEntry(entry))
	}
}

const setTotal = (total, operation) => {
	operation = operation ? operation : null;
	return ({
		type: 'SET_TOTAL',
		total,
		operation
	})
}

const addToTotal = (entry, operation) => ({
	type: 'ADD_TO_TOTAL',
	entry,
	operation
})

const subtractFromTotal = (entry, operation) => ({
	type: 'SUBTRACT_FROM_TOTAL',
	entry,
	operation
})

const multiplyWithTotal = (entry, operation) => ({
	type: 'MULTIPLY_WITH_TOTAL',
	entry,
	operation
})

const divideFromTotal = (entry, operation) => ({
	type: 'DIVIDE_FROM_TOTAL',
	entry,
	operation
})

const performOperation = (operation) => {
	return (dispatch, getState) => {
    const state = getState()
    const entry = state.entry
    const total = state.total
    const previousOperation = state.operation

    if (entry === 0) {
			return dispatch(setOperation(operation))
		}
		if (total === 0) {
			return dispatch(setTotal(entry, operation))
		}
		switch (previousOperation) {
			case 'add': return dispatch(addToTotal(entry, operation))
			case 'subtract': return dispatch(subtractFromTotal(entry, operation))
			case 'multiply': return dispatch(multiplyWithTotal(entry, operation))
			case 'divide': return dispatch(divideFromTotal(entry, operation))
			default: return state;
		}
	}
}

const totalToEntry = (total) => ({
	type: 'TOTAL_TO_ENTRY',
	total
})

const showTotal = () => {
	return (dispatch, getState) => {
		dispatch(performOperation(null))
    const state = getState()
    dispatch(totalToEntry(state.total))
  }
}

/*
 * Redux Reducers
 */

const entry = (state = 0, action) => {
	switch (action.type) {
		case 'ALL_CLEAR':
		case 'CLEAR_ENTRY':
		case 'ADD_TO_TOTAL':
		case 'SUBTRACT_FROM_TOTAL':
		case 'MULTIPLY_WITH_TOTAL':
		case 'DIVIDE_FROM_TOTAL':
		case 'SET_TOTAL':
			return 0
		case 'SET_ENTRY':
			return action.entry
		case 'TOTAL_TO_ENTRY':
			return action.total
		default:
			return state
	}
}

const operation = (state = null, action) => {
	switch (action.type) {
		case 'ALL_CLEAR':
		case 'CLEAR_ENTRY':
		case 'TOTAL_TO_ENTRY':
			return null
		case 'ADD_TO_TOTAL':
		case 'SUBTRACT_FROM_TOTAL':
		case 'MULTIPLY_WITH_TOTAL':
		case 'DIVIDE_FROM_TOTAL':
		case 'SET_TOTAL':
		case 'SET_OPERATION':
			return action.operation
		default:
			return state
	}
}

const total = (state = 0, action) => {
	switch (action.type) {
		case 'ALL_CLEAR':
		case 'TOTAL_TO_ENTRY':
			return 0
		case 'ADD_TO_TOTAL':
			return state += action.entry
		case 'SUBTRACT_FROM_TOTAL':
			return state -= action.entry
		case 'MULTIPLY_WITH_TOTAL':
			return state *= action.entry
		case 'DIVIDE_FROM_TOTAL':
			return state /= action.entry
		case 'SET_TOTAL':
			return action.total
		default:
			return state
	}
}

const calculatorApp = combineReducers({
	entry,
	operation,
	total
})

/*
 * Redux Store
 */

let store = createStore(calculatorApp, applyMiddleware(thunk))

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
ButtonAC.propTypes = {
	onClick: PropTypes.func.isRequired
}

const ButtonCE = (props) => (
	<Button
		bsStyle='warning'
		block
		onClick={() => props.onClick()} >
		CE
	</Button>
)
ButtonCE.propTypes = {
	onClick: PropTypes.func.isRequired
}

const ButtonEquals = (props) => (
	<Button
		bsStyle='success'
		block
		onClick={() => props.onClick()} >
		=
	</Button>
)
ButtonEquals.propTypes = {
	onClick: PropTypes.func.isRequired
}

const ButtonOperation = (props) => (
	<Button
		block
		bsStyle={props.operation === props.operationState ? 'primary' : 'info'}
		onClick={() => props.onClick(props.operation)} >
		{props.visualSymbol}
	</Button>
)
ButtonOperation.propTypes = {
	operation: PropTypes.string.isRequired,
	operationState: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	visualSymbol: PropTypes.string.isRequired
}

const ButtonNumber = (props) => (
	<Button
		block 
		onClick={() => props.onClick(props.number)} >
		{props.number}
	</Button>
)
ButtonNumber.propTypes = {
	number: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired
}

const CalculatorDisplay = (props) => (
	<Col xs={12} md={6} mdOffset={3}>
		<Well className='lead text-right'>
			{props.entry}
		</Well>
	</Col>
)
CalculatorDisplay.propTypes = {
	entry: PropTypes.number.isRequired
}

const CalculatorButtons = (props) => (
	<Col id='calculator-buttons' xs={12} md={6} mdOffset={3}>
  	<Col xs={3}>
  		<ButtonAC onClick={props.handleAllClearClick} />
  		<ButtonNumber number={7} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={4} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={1} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={0} onClick={props.handleAppendToEntry} />
  	</Col>
  	<Col xs={3}>
  		<ButtonCE onClick={props.handleClearEntryClick} />
  		<ButtonNumber number={8} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={5} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={2} onClick={props.handleAppendToEntry} />
  	</Col>
  	<Col xs={3}>
  		<ButtonEquals value={props.value} operator={props.operator} total={props.total} onClick={props.handleShowTotal} />
  		<ButtonNumber number={9} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={6} onClick={props.handleAppendToEntry} />
  		<ButtonNumber number={3} onClick={props.handleAppendToEntry} />
  	</Col>
  	<Col xs={3}>
  		<ButtonOperation visualSymbol='+' operation='add' operationState={props.operation} onClick={props.handlePerformOperation} />
 			<ButtonOperation visualSymbol='–' operation='subtract' operationState={props.operation} onClick={props.handlePerformOperation} />
			<ButtonOperation visualSymbol='x' operation='multiply' operationState={props.operation} onClick={props.handlePerformOperation} />
			<ButtonOperation visualSymbol='÷' operation='divide' operationState={props.operation} onClick={props.handlePerformOperation} />
  	</Col>
  </Col>
)
CalculatorButtons.propTypes = {
	operation: PropTypes.string,
	handleAllClearClick: PropTypes.func.isRequired,
	handleClearEntryClick: PropTypes.func.isRequired,
	handleAppendToEntry: PropTypes.func.isRequired,
	handlePerformOperation: PropTypes.func.isRequired
}

/*
 * React-Redux Container Components
 */

const mapStateToProps = (state) => ({
	operation: state.operation
})

const mapDispatchToProps = (dispatch) => ({
	handleAllClearClick: () => {
		dispatch(allClear())
	},
	handleClearEntryClick: () => {
		dispatch(clearEntry())
	},
	handleAppendToEntry: (input) => {
		dispatch(appendToEntry(input))
	},
	handlePerformOperation: (operation) => {
		dispatch(performOperation(operation))
	},
	handleShowTotal: () => {
		dispatch(showTotal())
	}
})

const CalculatorButtonsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CalculatorButtons)

const mapStateToPropsTwo = (state) => ({
	entry: state.entry
})

const CalculatorDisplayContainer = connect(
	mapStateToPropsTwo
)(CalculatorDisplay)


const App = (props) => (
	<div className="App">
	  <Header />
	  <Col xs={12} md={8} mdOffset={2}>
	  	<CalculatorDisplayContainer />
	  	<CalculatorButtonsContainer />
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
console.log('entry: 4')
store.dispatch(appendToEntry(4))
console.log('entry: 42')
store.dispatch(appendToEntry(2))
console.log('set operation: divide')
store.dispatch(performOperation('divide'))
console.log('set operation: add')
store.dispatch(setOperation('add'))
console.log('entry: 9')
store.dispatch(appendToEntry(9))
console.log('set operation: subtract')
store.dispatch(performOperation('subtract'))
console.log('entry: 7')
store.dispatch(appendToEntry(7))

console.log('set operation: divide')
store.dispatch(performOperation('divide'))
console.log('entry: 0')
store.dispatch(appendToEntry(0))

console.log('show total')
store.dispatch(showTotal())
console.log('show total')
store.dispatch(showTotal())
console.log('allClear')
store.dispatch(allClear())
console.log('show total')
store.dispatch(showTotal())

console.log('entry: 7')
store.dispatch(appendToEntry(7))
console.log('set operation: subtract')
store.dispatch(performOperation('subtract'))

console.log('show total')
store.dispatch(showTotal())
console.log('entry: 7')
store.dispatch(appendToEntry(7))
*/

