import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { PageHeader, Col, Button, ButtonToolbar, Well, Panel, ListGroup, ListGroupItem, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import './index.scss';

const EditRecipeButton = (props) => (
  <Button onClick={props.onEditRecipe}>
    Edit
  </Button>
)

const DeleteRecipeButton = (props) => (
  <Button bsStyle="danger" onClick={props.onDeleteRecipe}>
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
//EditRecipeForm = connect()(EditRecipeForm)

const EditRecipeModal = (props) => (
  <Modal show={props.showModal} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Recipe</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <EditRecipeForm onAddRecipe={props.onAddRecipe} />
    </Modal.Body>
  </Modal>
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

const RecipesContainer = (props) => (
  <Well>
    {props.recipes.map((recipe, index) => {
      return (
        <Panel key={index} header={recipe.title} collapsible bsStyle='info'>
          <h4>Ingredients</h4>
          <IngredientsList ingredients={recipe.ingredients} />
          <ButtonToolbar>
            <DeleteRecipeButton />
            <EditRecipeButton />
          </ButtonToolbar>
        </Panel>
      )
    })}
  </Well>
)
RecipesContainer.propTypes = {
  recipes: PropTypes.array.isRequired
}

const AddRecipeButton = (props) => (
  <Button bsStyle="primary" onClick={props.onAddRecipe}>
    Add Recipe
  </Button>
)
AddRecipeButton.propTypes = {
  onAddRecipe: PropTypes.func.isRequired
}


const Header = (props) => (
  <PageHeader>React Recipe Book w/ Local Storage</PageHeader>
)

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

let initialState = [
  {
    id: 0,
    title: 'Nate\'s famous bagels',
    ingredients: ['1 bagel', 'plentiful cream cheese']
  },
  {
    id: 1,
    title: 'Waffels',
    ingredients: ['1 waffel', 'Maple Syrup']
  }
]

let nextRecipeId = initialState.length - 1;

// notes this function assembles redux dispatch call
const addRecipe = (object) => {
  return {
    type: 'ADD_RECIPE',
    id: nextRecipeId++,
    title: object.title,
    ingredients: object.ingredients
  }
}

// notes: this function only returns new object or modified object
const recipeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_RECIPE':
      return {
        id: action.id,
        title: action.title,
        ingredients: action.ingredients
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      }

      return Object.assign({}, state, {
        completed: !state.completed
      })

    default:
      return state
  }
}

// notes: this function is only responsible for handling immutability
const recipesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RECIPE': // returns array from original plus additional object
      return [
        ...state,
        recipeReducer(undefined, action)
      ]
    case 'TOGGLE_TODO': // returns array from original with modified object
      return state.map(t =>
        recipeReducer(t, action)
      )
    default:
      return state
  }
}

const recipesApp = combineReducers({
  recipesReducer
})

let store = createStore(recipesApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);



