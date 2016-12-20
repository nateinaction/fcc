import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
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
	config: {
		interval: 1000,
		tileSize: 30
	},
	gameBoard: {
		rows: 26,
		columns: 48,
		tiles: [
			{
				id: '3759',
				state: 'child',
				row: 2,
				column: 30
			}
		]
	}
}
*/

/*
 * Helper Fns
 */

const getViewport = () => {
	const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	return {height, width}
}

// generateNewTile
const generateNewTile = (row, column) => ({
	id: uuidV4(),
	state: (Math.random() > 0.5) ? 'child' : 'dead',
	row,
	column
})

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

const setDimensions = (rows, columns) => ({
	type: 'SET_DIMENSIONS',
	rows,
	columns
})

const setTiles = (tiles) => ({
	type: 'SET_DIMENSIONS',
	tiles
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

const config = (state = {interval: 500, tileSize: 30}, action) => {
	switch (action.type) {
		case 'SET_INTERVAL':
			return Object.assign({}, state, {
				interval: action.interval
  		})
  	case 'SET_TILE_SIZE':
			return Object.assign({}, state, {
				tileSize: action.tileSize
  		})
		default:
			return state
	}
}

const initialGameBoard = {rows: 0, columns: 0, tiles: []}
const gameBoard = (state = initialGameBoard, action) => {
	switch (action.type) {
		case 'SET_DIMENSIONS':
			console.log('poke again')
			return Object.assign({}, state, {
				rows: action.rows,
				columns: action.columns
  		})
  	case 'SET_TILES':
			return Object.assign({}, state, {
				tiles: action.tiles
  		})
		case 'CLEAR':
			return Object.assign({}, state, {
				tiles: []
  		})
		default:
			return state
	}
}

const gameOfLifeApp = combineReducers({
	play,
	generation,
	config,
	gameBoard
})

/*
 * Redux Store
 */

let store = createStore(gameOfLifeApp, applyMiddleware(thunk))

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



const setGameBoardDimensions = () => {
	return (dispatch, getState) => {
		const state = getState()
		const tileSize = state.gameBoard.tileSize
		const dimensions = getViewport()
		const rows = dimensions.height/tileSize
		const columns = dimensions.width/tileSize
		return dispatch(setDimensions(rows, columns))
	}
}

const setGameBoardTiles = () => {
	return (dispatch, getState) => {
		console.log('poke')
		const state = getState()
		const rows = state.gameBoard.rows
		const columns = state.gameBoard.columns

		let tiles = [];
		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < columns; column++) {
				let tile = generateNewTile(row, column)
				gameBoard.push(tile)
			}
		}

		return dispatch(setTiles(tiles))
	}
}

// Generate game board
const generateGameBoard = () => {

	setGameBoardDimensions()
	setGameBoardTiles()
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
