import { createStore, combineReducers } from 'redux'
import React, { Component, PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import shortid from 'shortid';
import { PageHeader, Col, Button, ButtonToolbar, Well, Panel, ListGroup, ListGroupItem, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import './index.scss';

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
store.subscribe(() =>
  console.log(store.getState())
)

/*
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
*/

/*
 * React Presentational Components
 */

const EditRecipeButton = (props) => (
  <Button onClick={props.onEditRecipe}>
    Edit
  </Button>
)

const DeleteRecipeButton = (props) => (
  <Button bsStyle="danger" onClick={props.handleClick}>
    Delete
  </Button>
)

const SaveRecipeButton = (props) => (
  <Button type='submit' bsStyle="success">
    Save
  </Button>
)

const EditTitle = (props) => (
  <FormGroup controlId='Title'>
    <ControlLabel>Title</ControlLabel>
    <FormControl type='input' placeholder='Recipe Title' />
  </FormGroup>
)

const EditIngredients = (props) => (
  <FormGroup controlId='Ingredients'>
    <ControlLabel>Ingredients</ControlLabel>
    <FormControl type='textarea' placeholder='Ingredients separated by commas' />
  </FormGroup>
)

const EditRecipeForm = (props) => {
  return (
    <form onSubmit={props.onAddRecipe}>
      <EditTitle />
      <EditIngredients />
      <SaveRecipeButton />
    </form>
  )
}
const AddRecipeButton = (props) => (
  <Button bsStyle="primary" onClick={props.handleClick}>
    Add Recipe
  </Button>
)
AddRecipeButton.propTypes = {
  handleClick: PropTypes.func.isRequired
}

const EditRecipeModal = (props) => (
	<div>
		<AddRecipeButton handleClick={props.handleShowModal} />
	  <Modal show={props.modal} onHide={props.handleHideModal}>
	    <Modal.Header closeButton>
	      <Modal.Title>Edit Recipe</Modal.Title>
	    </Modal.Header>
	    <Modal.Body>
	      <EditRecipeForm onAddRecipe={props.onAddRecipe} />
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
    return <ListGroupItem>Add some ingredients!</ListGroupItem>
  }

  return (
    <ListGroup>
      {props.ingredients.map((ingredient) => {
        return (
          <Ingredient key={ingredient} ingredient={ingredient} />
        )
      })}
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
	      return (
	        <Panel key={recipe.id} header={recipe.title} collapsible bsStyle='info'>
	          <h4>Ingredients</h4>
	          <IngredientsList ingredients={recipe.ingredients} />
	          <ButtonToolbar>
	            <DeleteRecipeButton handleClick={() => props.handleDeleteClick(recipe.id)} />
	            <EditRecipeButton />
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
  <PageHeader>React Recipe Book w/ Local Storage</PageHeader>
)

/*
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [{
        title: 'Nate\'s famous bagels',
        ingredients: ['1 bagel', 'plentiful cream cheese']
      },
      {
        title: 'Waffels',
        ingredients: ['1 waffel', 'Maple Syrup']
      }],
      showModal: false,
      isLoading: true
    }
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    })
  }

  handleHideModal() {
    this.setState({
      showModal: false
    })
  }

  handleShowModal() {
    this.setState({
      showModal: true
    })
  }

  handleAddRecipe(e) {
    e.preventDefault()
    //console.log(input.value)
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Col xs={12} md={8} mdOffset={2}>
          <RecipesContainer recipes={this.state.recipes} />
          <AddRecipeButton onAddRecipe={this.handleShowModal} />
          <EditRecipeModal showModal={this.state.showModal} onHide={this.handleHideModal} onAddRecipe={this.handleAddRecipe} />
        </Col>
      </div>
    );
  }
}
*/

const mapStateToProps = (state) => ({
	recipes: state.recipes
})

const mapDispatchToProps = (dispatch) => ({
	handleDeleteClick: (id) => {
		dispatch(deleteRecipe(id))
	},
	handleEditClick: (id) => {
		dispatch(editRecipe(id))
	}
})

const RecipeList = connect(
	mapStateToProps,
	mapDispatchToProps
)(RecipesContainer)

const mapStateToPropsTwo = (state) => ({
	modal: state.modal
})

const mapDispatchToPropsTwo = (dispatch) => ({
	handleShowModal: () => {
		dispatch(showModal())
	},
	handleHideModal: () => {
		dispatch(hideModal())
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
store.dispatch(addRecipe(
		shortid.generate(),
		'Nate\'s banana pudding',
		['bananas', 'nilla wafers', 'vanilla pudding mix']
))

/*
 * React Dom
 */

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
