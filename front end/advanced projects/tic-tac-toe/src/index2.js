import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import { PageHeader, Navbar, Nav, NavItem, Glyphicon, ProgressBar, Modal, FormGroup, ControlLabel, FormControl, Button, InputGroup } from 'react-bootstrap';
import './index.scss';

/*
 * Example Object
 */
/*
{
	player: null || 'x' || 'o',
	turn: 'x' || 'o',
	gameBoard: [null, null, 'x',
							null, 'o', 'x',
							null, null, 'o']
}
*/

const gameBoardInitialState = () => {
	let blankBoard = [];
	for (var n = 1; n <= 9; n++) {
		blankBoard.push(null)
	}
	return blankBoard
}

/*
 * Redux Action Creators
 */

/*
const setPlay = (bool) => ({
	type: 'SET_PLAY',
	bool
})

const setVisibleTimer = (timer) => ({
	type: 'SET_VISIBLE_TIMER',
	timer
})

const setPomodoroLength = (time) => ({
	type: 'SET_POMODORO_LENGTH',
	time
})

const setBreakLength = (time) => ({
	type: 'SET_BREAK_LENGTH',
	time
})

const decrementTimeRemaining = () => ({
	type: 'DECREMENT_TIME_REMAINING'
})

const showModal = (bool) => ({
	type: 'SHOW_MODAL',
	bool
})

const reset = (time) => ({
	type: 'RESET',
	time
})

const resetTimer = () => {
	return (dispatch, getState) => {
    const state = getState()
    let visibleTimer = state.timer.visibleTimer
    let pomodoroLength = state.initialLength.pomodoro
    let breakLength = state.initialLength.break

    if (visibleTimer === 'pomodoro') {
    	return dispatch(reset(pomodoroLength))
    } else {
    	return dispatch(reset(breakLength))
    }
	}
}
*/

const setPlayer = (piece) => ({
	type: 'SET_PLAYER',
	piece
})

const setAsX = (index) => ({
	type: 'SET_AS_X',
	index
})

const setAsO = (index) => ({
	type: 'SET_AS_O',
	index
})

const tileClick = (index) => {
	return (dispatch, getState) => {
    const state = getState()
    let turn = state.turn
    let player = state.player

    if (turn === player && player === 'x') {
    	return dispatch(setAsX(index))
    } else if (turn === player && player === 'o') {
    	return dispatch(setAsO(index))
    }
	}
}

/*
 * Redux Reducers
 */

const player = (state = null, action) => {
	switch (action.type) {
		case 'SET_PLAYER':
			return action.piece
		case 'RESET':
			return null
		default:
			return state
	}
}

const turn = (state = 'x', action) => {
	switch (action.type) {
		case 'SET_X_TURN':
			return 'x'
		case 'SET_O_TURN':
			return 'o'
		case 'RESET':
			return null
		default:
			return state
	}
}

const gameBoard = (state = gameBoardInitialState(), action) => {
	switch (action.type) {
		case 'SET_AS_X':
			return state.map((tile, id) => {
				if (id === action.id) {
					return 'x'
				}
				return tile
			})
		case 'SET_AS_O':
			return state.map((tile, id) => {
				if (id === action.id) {
					return 'o'
				}
				return tile
			})
		case 'RESET':
			return gameBoardInitialState()
		default:
			return state
	}
}

const ticTacToeApp = combineReducers({
	player,
	turn,
	gameBoard
})

/*
 * Redux Store
 */

let store = createStore(ticTacToeApp, applyMiddleware(thunk))

/*
 * Helper Fns
 */

const ai = () => {
	store.subscribe(() => {
		let state = store.getState()
		let player = state.player
		let piece = (player === 'x') ? 'o' : 'x'
		let turn = state.turn
		let gameBoard = state.gameBoard
		if (player !== null && piece === turn) {
      // if player has NOT gone, choose one of the corners OR the center [0, 2, 3, 5, 6, 8, 4]
      // if player has gone once, place into center [4] if unavailable, place into corner [0, 2, 3, 5, 6, 8]
      // if player has gone MORE THAN once then look for instances of two in a row
    }
	})
}
//timerHelper()

/*
 * Redux state to console log
 */

console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))


/*
 * React Components
 */

const SelectXButton = (props) => (
	<Button
		bsStyle='primary'
		block
		onClick={() => props.onSetPlayer('x')} >
		Play as <Glyphicon glyph='remove' />
	</Button>
)

const SelectOButton = (props) => (
	<Button
		bsStyle='success'
		block
		onClick={() => props.onSetPlayer('o')} >
		Play as <Glyphicon glyph='unchecked' />
	</Button>
)

const SettingsModal = (props) => {
	let showModal = (props.player === null)
	return (
	  <Modal show={showModal}>
	    <Modal.Header>
	      <Modal.Title>Tic-Tac-Toe - New Game</Modal.Title>
	    </Modal.Header>
	    <Modal.Body>
	    	<p>Select your game piece. <Glyphicon glyph='remove' /> plays first.</p>
	      <SelectXButton onSetPlayer={props.handleSetPlayer} />
	      <SelectOButton onSetPlayer={props.handleSetPlayer} />
	    </Modal.Body>
	  </Modal>
	)
}

const tileClass = (tile) => {
	if (tile === 'x') {
		return 'tile-x .glyphicon-remove'
	} else if (tile === 'o') {
		return 'tile-o .glyphicon-unchecked'
	}
	return 'tile-blank'
}

const GameBoard = (props) => (
	<div>
	{props.gameBoard.map((tile, index) => (
			<div
				key={index}
				className={tileClass(tile)}
				onClick={() => props.handleTileClick(index)} />
		))}
	</div>
)

/*
 * React-Redux Container Components
 */

const mapStateToProps = (state) => ({
	gameBoard: state.gameBoard
})

const mapDispatchToProps = (dispatch) => ({
	handleTileClick: (index) => {
		dispatch(tileClick(index))
	}
})

const GameBoardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GameBoard)

const mapStateToPropsTwo = (state) => ({
	player: state.player
})

const mapDispatchToPropsTwo = (dispatch) => ({
	handleSetPlayer: (piece) => {
		dispatch(setPlayer(piece))
	}
})

const SettingsModalContainer = connect(
	mapStateToPropsTwo,
	mapDispatchToPropsTwo
)(SettingsModal)

/*
 * React Root Component
 */

const App = (props) => (
	<div id='App'>
		<PageHeader>Tic-Tac-Toe <small> with React & Redux</small></PageHeader>
		<SettingsModalContainer />
		<GameBoardContainer />
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

