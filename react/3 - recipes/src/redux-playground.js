import { createStore, combineReducers } from 'redux'
//import React, { Component, PropTypes } from 'react';
//import { Provider, connect } from 'react-redux'

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
		showModal: false,
		edit: 
	}
}
*/

/*
 * Redux Action Creators
 */

const saveRecipe = (id, title, ingredients) => ({
	type: 'SAVE_RECIPE',
	id,
	title,
	ingredients
})

const deleteRecipe = (id) => ({
	type: 'DELETE_RECIPE',
	id
})

const showModal = (id) => ({
	type: 'SHOW_MODAL',
	id
})

const hideModal = () => ({
	type: 'HIDE_MODAL'
})

/*
 * Redux Reducers
 */

const recipes = (state = [], action) => {
	switch (action.type) {
		case 'SAVE_RECIPE':
			if (state.map((recipe) => recipe.id).indexOf(action.id)) {
				return [
					...state,
					{
						id: action.id,
						title: action.title,
						ingredients: action.ingredients
					}
				]
			}
			return state.map((recipe) => {
				if (recipe.id === action.id) {
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

let initialModalState = {
	showModal: false,
	edit: 'NEW'
}
const modal = (state = initialModalState, action) => {
	switch (action.type) {
		case 'SHOW_MODAL':
			if (action.id !== undefined) {
				return Object.assign({}, state, {
					showModal: true,
					edit: action.id
      	})
			}
			return Object.assign({}, state, {
				showModal: true,
				edit: 'NEW'
      })
		case 'HIDE_MODAL':
			return Object.assign({}, state, {
 				showModal: false
      })
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
store.dispatch(saveRecipe(
		"Scooby",
		'Nate\'s banana pudding',
		['bananas', 'nilla wafers', 'vanilla pudding mix']
))
console.log('add a second recipe')
store.dispatch(saveRecipe(
		"Doo",
    'Nate\'s famous bagels',
    ['a bagel', 'plentiful cream cheese']
))
console.log('edit a recipe')
store.dispatch(saveRecipe(
		"Scooby",
		'Nate\'s BIG BAD BANANA PUDDING',
		['BANANAS', 'nilla wafers', 'vanilla pudding mix']
))
console.log('delete a recipe')
store.dispatch(deleteRecipe("Scooby"))
/*
console.log('show modal')
store.dispatch(showModal())
console.log('hide modal')
store.dispatch(hideModal())
console.log('show modal with edit id')
store.dispatch(showModal('EDIT_ME'))
*/

// Stop listening to state updates
unsubscribe()
