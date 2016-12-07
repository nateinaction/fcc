import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import { Provider } from 'react-redux'
//import { createStore } from 'redux'
import { PageHeader, Col, Button, Well, Panel, ListGroup, ListGroupItem, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
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
  <Button type='submit' bsStyle="success" onClick={props.onSaveRecipe}>
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

const EditRecipeForm = (props) => (
  <form>
    <EditTitle />
    <EditIngredients />
    <SaveRecipeButton />
  </form>
)

const EditRecipeModal = (props) => (
  <Modal show={props.showModal} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Recipe</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <EditRecipeForm />
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
    <ListGroup fill>
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
          <Col xs={12} md={1}>
            <DeleteRecipeButton />
          </Col>
          <Col xs={12} md={1}>
            <EditRecipeButton  />
          </Col>
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
    this.handleAddRecipe = this.handleAddRecipe.bind(this);
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

  handleAddRecipe() {
    this.setState({
      showModal: true
    })
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Col xs={12} md={8} mdOffset={2}>
          <RecipesContainer recipes={this.state.recipes} />
          <AddRecipeButton onAddRecipe={this.handleAddRecipe} />
          <EditRecipeModal showModal={this.state.showModal} onHide={this.handleHideModal} />
        </Col>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
