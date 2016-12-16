import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

/*
 * Example Object
 */
/*
{
	entry: 44,
	operation: 'multiply',
	total: 220
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

const showTotal = () => {
	return (dispatch, getState) => {
		dispatch(performOperation(null))
    const state = getState()
    const total = state.total
    dispatch(allClear(total))
    dispatch(setEntry(total))
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
		default:
			return state
	}
}

const operation = (state = null, action) => {
	switch (action.type) {
		case 'ALL_CLEAR':
		case 'CLEAR_ENTRY':
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
 * Redux state to console log
 */

console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))

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
/* divide by 0
console.log('set operation: divide')
store.dispatch(performOperation('divide'))
console.log('entry: 0')
store.dispatch(appendToEntry(0))
*/
/*
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

