//import React, { Component, PropTypes } from 'react';
//import { render } from 'react-dom';
//import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'

/*
{
	recipes: [{
		id: 0,
		title: 'Nate\'s banana pudding',
		ingredients: ['bananas', 'nilla wafers', 'vanilla pudding mix']
	},
	{
		id: 1,
    title: 'Nate\'s famous bagels',
    ingredients: ['a bagel', 'plentiful cream cheese']
	}],
	modal: {
		showModal: false
	}
}
*/

/*
 * Redux Action Creators
 */

const addRecipe = (id, title, ingredients) => ({
	type: 'ADD_RECIPE',
	id,
	title,
	ingredients
})

const editRecipe = (id, title, ingredients) => ({
	type: 'EDIT_RECIPE',
	id,
	title,
	ingredients
})

const deleteRecipe = (id) => ({
	type: 'DELETE_RECIPE',
	id
})

const showModal = () => ({
	type: 'SHOW_MODAL',
})

const hideModal = () => ({
	type: 'HIDE_MODAL',
})

/*
 * Redux Reducers
 */

const recipes = (state = [], action) => {
	switch (action.type) {
		case 'ADD_RECIPE':
			return [
				...state,
				{
					id: action.id,
					title: action.title,
					ingredients: action.ingredients
				}
			]
		case 'EDIT_RECIPE':
			return state.map((recipe, id) => {
				if (id === action.id) {
					return Object.assign({}, recipe, {
 						title: action.title,
						ingredients: action.ingredients
      		})
				}
				return recipe
			})
		case 'DELETE_RECIPE':
			return state.filter(recipe => recipe.id !== action.id)
		default:
			return state
	}
}

const modal = (state = false, action) => {
	switch (action.type) {
		case 'SHOW_MODAL':
			return true
		case 'HIDE_MODAL':
			return false
		default:
			return state
	}
}

const recipeApp = combineReducers({
	recipes,
	modal
})

/*
 * Redux Store
 */

let store = createStore(recipeApp)

/*
 * Redux state to console log
 */

// log initial state
console.log('initial state')
console.log(store.getState())
// log on change
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Dispatch some actions
console.log('add a recipe')
store.dispatch(addRecipe(
		0,
		'Nate\'s banana pudding',
		['bananas', 'nilla wafers', 'vanilla pudding mix']
))
console.log('add a second recipe')
store.dispatch(addRecipe(
		1,
    'Nate\'s famous bagels',
    ['a bagel', 'plentiful cream cheese']
))
console.log('edit a recipe')
store.dispatch(editRecipe(
		0,
		'Nate\'s BIG BAD BANANA PUDDING',
		['BANANAS', 'nilla wafers', 'vanilla pudding mix']
))
console.log('delete a recipe')
store.dispatch(deleteRecipe(1))
console.log('show modal')
store.dispatch(showModal())
console.log('hide modal')
store.dispatch(hideModal())

// Stop listening to state updates
unsubscribe()

