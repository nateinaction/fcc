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

const showModal = (id, title, ingredients) => ({
	type: 'SHOW_MODAL',
	id,
	title,
	ingredients
})

const hideModal = () => ({
	type: 'HIDE_MODAL'
})

const changeWorkingRecipe = (field, contents) => ({
	type: 'CHANGE_WORKING_RECIPE',
	field,
	contents
})

/*
 * Redux Reducers
 */

const recipes = (state = [], action) => {
	switch (action.type) {
		case 'SAVE_RECIPE':
			if (state.map((recipe) => recipe.id).indexOf(action.id) === -1) {
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
	id: 'NEW',
	title: '',
	ingredients: []
}
const modal = (state = initialModalState, action) => {
	switch (action.type) {
		case 'SHOW_MODAL':
			if (action.id !== undefined) {
				return Object.assign({}, state, {
					showModal: true,
					id: action.id,
					title: action.title,
					ingredients: action.ingredients
      	})
			}
			return Object.assign({}, state, {
				showModal: true,
				id: 'NEW',
				title: '',
				ingredients: []
      })
		case 'HIDE_MODAL':
			return Object.assign({}, state, {
 				showModal: false
      })
    case 'CHANGE_WORKING_RECIPE':
    	if (action.field === 'title') {
				return Object.assign({}, state, {
					title: action.contents
      	})
			}
			return Object.assign({}, state, {
				ingredients: action.contents
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
 * Redux Store & Local Storage
 */

// import store from local storage
const persistedState = localStorage.getItem('_nateinaction_reduxState') ? JSON.parse(localStorage.getItem('_nateinaction_reduxState')) : {}

// initialize store
let store = createStore(recipeApp, persistedState)

// save store to local storage
store.subscribe(()=>{
  localStorage.setItem('_nateinaction_reduxState', JSON.stringify(store.getState()))
})

/*
 * React Presentational Components
 */


const EditRecipeButton = (props) => (
  <Button onClick={props.handleClick}>
    Edit
  </Button>
)

const DeleteRecipeButton = (props) => (
  <Button bsStyle="danger" onClick={props.handleClick}>
    Delete
  </Button>
)

const EditTitle = (props) => (
  <FormGroup controlId='Title'>
    <ControlLabel>Title</ControlLabel>
    <FormControl
    	onChange={(e) => {
    		e.preventDefault()
    		return props.onRecipeChange('title', e.target.value)
    	}}
    	value={props.defaultValue}
    	type='input'
    	placeholder='Recipe Title' />
  </FormGroup>
)

const EditIngredients = (props) => (
  <FormGroup controlId='Ingredients'>
    <ControlLabel>Ingredients</ControlLabel>
    <FormControl
    	onChange={(e) => {
    		e.preventDefault()
    		let value = e.target.value;
    		let tempArray = (value !== '') ? value.split(', ') : [];
    		return props.onRecipeChange('ingredients', tempArray)
    	}}
    	value={props.defaultValue.join(', ')}
    	type='textarea'
    	placeholder='Ingredients separated by commas' />
  </FormGroup>
)

const SaveRecipeButton = (props) => (
  <Button
  	bsStyle="success"
  	onClick={() => {
  		let id = (props.id === 'NEW') ? uuidV4() : props.id;
  		return props.onSaveClick(id, props.title, props.ingredients)
  	}}>
    Save
  </Button>
)

const EditRecipeForm = (props) => (
  <form>
    <EditTitle
    	id={props.id}
    	defaultValue={props.title}
    	onRecipeChange={props.handleRecipeChange} />
    <EditIngredients
    	id={props.id}
    	defaultValue={props.ingredients}
    	onRecipeChange={props.handleRecipeChange} />
    <SaveRecipeButton
    	id={props.id}
    	title={props.title}
    	ingredients={props.ingredients}
    	onSaveClick={props.handleSaveClick} />
  </form>
)


const AddRecipeButton = (props) => (
  <Button bsStyle="primary" onClick={props.onClick}>
    Add Recipe
  </Button>
)
AddRecipeButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

const EditRecipeModal = (props) => (
	<div>
		<AddRecipeButton onClick={props.handleShowNewModal} />
	  <Modal show={props.modal.showModal} onHide={props.handleHideModal}>
	    <Modal.Header closeButton>
	      <Modal.Title>Edit Recipe</Modal.Title>
	    </Modal.Header>
	    <Modal.Body>
	      <EditRecipeForm
	      	id={props.modal.id}
	      	title={props.modal.title}
	      	ingredients={props.modal.ingredients}
	      	handleRecipeChange={props.handleRecipeChange}
	      	handleSaveClick={props.handleSaveClick} />
	    </Modal.Body>
	  </Modal>
  </div>
)

const Ingredient = (props) => (
  <ListGroupItem>{props.ingredient}</ListGroupItem>
)
Ingredient.propTypes = {
  ingredient: PropTypes.string.isRequired
}

const IngredientsList = (props) => {
  if (props.ingredients.length === 0) {
    return <ListGroup><ListGroupItem>Add some ingredients!</ListGroupItem></ListGroup>
  }
  return (
    <ListGroup>
      {props.ingredients.map((ingredient, index) => (
      	<Ingredient key={index} ingredient={ingredient} />
      ))}
    </ListGroup>
  )
}
IngredientsList.propTypes = {
  ingredients: PropTypes.array.isRequired
}

const RecipesContainer = (props) => {
	if (props.recipes.length === 0) {
		return (
			<Well>
				<h2>Add a recipe!</h2>
			</Well>
		)
	}
	return (
	  <Well>
	    {props.recipes.map((recipe) => {
	    	let title = (recipe.title !== '') ? recipe.title : 'Untitled';
	      return (
	        <Panel key={recipe.id} header={title} collapsible bsStyle='info'>
	          <h4>Ingredients</h4>
	          <IngredientsList ingredients={recipe.ingredients} />
	          <ButtonToolbar>
	            <DeleteRecipeButton handleClick={() => props.handleDeleteClick(recipe.id)} />
	            <EditRecipeButton handleClick={() => props.handleShowEditModal(recipe.id, recipe.title, recipe.ingredients)} />
	          </ButtonToolbar>
	        </Panel>
	      )
	    })}
	  </Well>
)}
RecipesContainer.propTypes = {
  recipes: PropTypes.array.isRequired
}

const Header = (props) => (
  <PageHeader>React Recipe Book <small>with Redux & Local Storage</small></PageHeader>
)

/*
 * React Redux Container
 */

const mapStateToProps = (state) => ({
	recipes: state.recipes
})

const mapDispatchToProps = (dispatch) => ({
	handleDeleteClick: (id) => {
		dispatch(deleteRecipe(id))
	},
	handleShowEditModal: (id, title, ingredients) => {
		dispatch(showModal(id, title, ingredients))
	}
})

const RecipeList = connect(
	mapStateToProps,
	mapDispatchToProps
)(RecipesContainer)

const mapStateToPropsTwo = (state) => ({
	modal: state.modal,
	recipes: state.recipes
})

const mapDispatchToPropsTwo = (dispatch) => ({
	handleShowNewModal: () => {
		dispatch(showModal())
	},
	handleHideModal: () => {
		dispatch(hideModal())
	},
	handleSaveClick: (id, title, ingredients) => {
		dispatch(saveRecipe(id, title, ingredients))
		dispatch(hideModal())
	},
	handleRecipeChange: (field, contents) => {
		dispatch(changeWorkingRecipe(field, contents))
	}
})

const RecipeModal = connect(
	mapStateToPropsTwo,
	mapDispatchToPropsTwo
)(EditRecipeModal)


const App = (props) => (
	<div className="App">
	  <Header />
	  <Col xs={12} md={8} mdOffset={2}>
	  	<RecipeList />
	  	<RecipeModal />
	  </Col>
  </div>
)

// provide 1 default recipe on initialization
if (store.getState().recipes.length === 0) {
	store.dispatch(saveRecipe(
			uuidV4(),
			'Nate\'s banana pudding',
			['bananas', 'nilla wafers', 'vanilla pudding mix']
	))
}

/*
 * React Dom
 */

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
