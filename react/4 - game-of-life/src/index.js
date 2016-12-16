import { createStore, combineReducers } from 'redux'
import React, { Component, PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import uuidV4 from 'uuid/v4';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import './index.scss';

/*
{
	play: true,
	generation: 0,
	interval: 1000,
	gameBoard: [{ // totally up in the air
		id: '3759'
		state: 'child',
		neighbors: {
			top: '0909',
			left: '860n',
			bottom: '4h56',
			right: '5h58'
		}
	}]
}
*/

/*
 * Redux Action Creators
 */

const playGame = () => ({
	type: 'PLAY'
})

const pauseGame = () => ({
	type: 'PAUSE'
})

const clearGame = () => ({
	type: 'CLEAR'
})

const nextGeneration = () => ({
	type: 'NEXT_GENERATION'
})

const newGameBoard = (gameBoard) => ({
	type: 'NEW_GAME_BOARD',
	gameBoard
})

const deathClick = (id) => ({
	type: 'DEATH_CLICK',
	id
})

/*
 * Redux Reducers
 */

const play = (state = true, action) => {
	switch (action.type) {
		case 'PLAY':
			return true
		case 'PAUSE':
			return false
		case 'CLEAR':
			return false
		default:
			return state
	}
}

const generation = (state = 0, action) => {
	switch (action.type) {
		case 'NEXT_GENERATION':
			return state + 1
		case 'CLEAR':
			return 0
		default:
			return state
	}
}

const interval = (state = 500, action) => {
	switch (action.type) {
		default:
			return state
	}
}

const gameBoard = (state = [], action) => {
	switch (action.type) {
		case 'NEW_GAME_BOARD':
			return action.gameBoard
		case 'CLEAR':
			return []
		default:
			return state
	}
}

const gameOfLifeApp = combineReducers({
	play,
	generation,
	interval,
	gameBoard
})

/*
 * Redux Store
 */

let store = createStore(gameOfLifeApp)

/*
 * Additional Game Logic
 */

// Generate game board
const generateGameBoard = () => {
	let gameBoard = [];
	for (let n = 0; n < 54; n++) {
		let tile = {
			id: uuidV4(),
			state: (Math.random() > 0.5) ? 'child' : 'dead'
		}
		gameBoard.push(tile)
	}
	//console.log(gameBoard)
	store.dispatch(newGameBoard(gameBoard))
}
generateGameBoard();

/*
 * React Presentational Components
 */

const GameTile = (props) => {
	if (props.lifeCycleStage === 'adult') {
		return (
			<div
				className='adult'
				onClick={props.handleDeathClick(props.id)} />
		)
	} else if (props.lifeCycleStage === 'child') {
		return (
			<div
				className='child'
				onClick={props.handleDeathClick(props.id)} />
		)
	} else {
		return (
			<div
				className='dead'
				onClick={props.handleLifeClick(props.id)} />
		)
	}
}

const GameBoard = (props) => (
	<div className='game-board'>
		{props.gameBoard.map((tile, index) => (
			<GameTile key={tile.id} id={tile.id} lifeCycleStage={tile.lifeCycleStage} />
		))}
	</div>
)

const PlayPauseButton = (props) => {
	if (props.play === false) {
		return <NavItem onClick={props.handlePlayClick}><Glyphicon glyph='play' /> Play</NavItem>
	} else {
		return <NavItem onClick={props.handlePauseClick}><Glyphicon glyph='pause' /> Pause</NavItem>
	}
}
PlayPauseButton.propTypes =  {
	play: PropTypes.bool.isRequired
}

const ClearButton = (props) => (
	<NavItem onClick={props.handleClearClick}><Glyphicon glyph='remove' /> Clear</NavItem>
)


class GenerationControl extends Component {
	componentWillUnmount() {
		clearInterval(this.getGeneration)
	}

	render() {
		if (this.props.play) {
			clearInterval(this.getGeneration)
			this.getGeneration = setInterval(this.props.handleNextGeneration, this.props.interval)
		} else {
			clearInterval(this.getGeneration)
		}

		return <Navbar.Text><strong>Generation:</strong> {this.props.generation}</Navbar.Text>
	}
}
GenerationControl.propTypes =  {
	play: PropTypes.bool.isRequired,
	interval: PropTypes.number.isRequired,
	generation: PropTypes.number.isRequired,
	handleNextGeneration: PropTypes.func.isRequired
}

const ControlBar = (props) => (
	<Navbar inverse collapseOnSelect fixedBottom>
    <Navbar.Header>
      <Navbar.Brand>
        Game Of Life
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
    	<Nav>
      	<PlayPauseButton
      		play={props.play}
      		handlePlayClick={props.handlePlayClick}
      		handlePauseClick={props.handlePauseClick} />
      	<ClearButton
      		handleClearClick={props.handleClearClick} />
      </Nav>
      <GenerationControl
      	play={props.play}
      	interval={props.interval}
      	generation={props.generation}
      	handleNextGeneration={props.handleNextGeneration} />
    </Navbar.Collapse>
  </Navbar>
)

/*
 * React-Redux Container Components
 */

const mapStateToProps = (state) => ({
	play: state.play,
	interval: state.interval,
	generation: state.generation
})

const mapDispatchToProps = (dispatch) => ({
	handlePlayClick: () => {
		dispatch(playGame())
	},
	handlePauseClick: () => {
		dispatch(pauseGame())
	},
	handleClearClick: () => {
		dispatch(clearGame())
	},
	handleNextGeneration: () => {
		dispatch(nextGeneration())
	}
})

const ControlBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ControlBar)

const mapStateToPropsTwo = (state) => ({
	gameBoard: state.gameBoard
})

const mapDispatchToPropsTwo = (dispatch) => ({

})

const GameBoardContainer = connect(
	mapStateToPropsTwo,
	mapDispatchToPropsTwo
)(GameBoard)

/*
 * React Root Component
 */

const App = (props) => (
	<div id='App'>
		<GameBoardContainer />
		<ControlBarContainer />
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
