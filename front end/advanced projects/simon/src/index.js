import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import React, { PropTypes } from 'react'
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
import { Grid, Row, Col, Button, Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap'
import './index.scss'
import blueSound from '../public/simonSound1.mp3'
import yellowSound from '../public/simonSound2.mp3'
import redSound from '../public/simonSound3.mp3'
import greenSound from '../public/simonSound4.mp3'

/*
 * Example Object
 */
/*
{
	turn: 'computer',
	level: 1,
	sequence: [0,0,3,1,2],
	player: [0,0...],
	strict: true,
	button: [false, true, false, false]
}
*/

/*
 * Redux Action Creators
 */

const clearAll = () => ({
	type: 'CLEAR_ALL'
})

const clearPlayer = () => ({
	type: 'CLEAR_PLAYER'
})

const setSequence = (sequence) => ({
	type: 'SET_SEQUENCE',
	sequence
})

const addToPlayer = (item) => ({
	type: 'ADD_TO_PLAYER',
	item
})

const toggleTurn = () => ({
	type: 'TOGGLE_TURN'
})

const toggleStrict = () => ({
	type: 'TOGGLE_STRICT'
})

const buttonClick = (id) => ({
	type: 'TOGGLE_BUTTON',
	id
})

/*
 * Redux Reducers
 */

const turn = (state = 'off', action) => {
	switch (action.type) {
		case 'CLEAR_ALL':
 			return 'off'
		case 'TOGGLE_TURN':
			return state === 'computer' ? 'player' : 'computer'
		default:
			return state
	}
}

const level = (state = 1, action) => {
 	switch (action.type) {
 		case 'CLEAR_ALL':
		case 'CLEAR_PLAYER':
 			return 1
 		case 'ADD_TO_PLAYER':
 			return state + 1
 		default:
 			return state
 	}
 }

const sequence = (state = [], action) => {
	switch (action.type) {
		case 'CLEAR_ALL':
			return []
		case 'SET_SEQUENCE':
			return action.sequence
		default:
			return state
	}
}

const player = (state = [], action) => {
	switch (action.type) {
		case 'CLEAR_ALL':
		case 'CLEAR_PLAYER':
			return []
		case 'ADD_TO_PLAYER':
			return [...state, action.item]
		default:
			return state
	}
}

const strict = (state = false, action) => {
	switch (action.type) {
		case 'TOGGLE_STRICT':
			return !state
		default:
			return state
	}
}

const defaultButtonState = Array(4).fill(false)
const button = (state = defaultButtonState, action) => {
	switch (action.type) {
		case 'CLEAR_ALL':
		case 'CLEAR_PLAYER':
		case 'TOGGLE_TURN':
			return defaultButtonState
		case 'TOGGLE_BUTTON':
			return state.map((bool, index) => (
				(index === action.id) ? !bool : false
			))
		default:
			return state
	}
}

const simonApp = combineReducers({
	turn,
	level,
	sequence,
	player,
	strict,
	button
})

/*
 * Redux Store
 */

let store = createStore(simonApp, applyMiddleware(thunk))

/*
 * Redux state to console log
 */

console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))

/*
 * Helper Fns
 */

const playSoundHelper = (number) => {
	document.getElementById('sound-' + number).play()
}

const audioController = (turn, sequence, level) => {
	let interval = null
	let n = 0
	if (turn === 'computer' && interval === null) {
		interval = setInterval(() => {
			let id = sequence[n]
			store.dispatch(buttonClick(id))
			if (n < level - 1) {
				n += 1
			} else {
				clearInterval(interval)
				interval = null
				store.dispatch(toggleTurn())
			}
    }, 750)
	} else {
		clearInterval(interval)
		interval = null
	}
}

const buttonController = (button) => {
	button.forEach((bool, index) => {
		if (bool === true) {
			playSoundHelper(index)
			//store.dispatch(buttonClick(index))
		}
	})
}

const newSequenceHelper = () => {
	return Array(20).fill(null).map(() => (
		Math.floor(Math.random() * 4)
	))
}

const dispatchNewSequence = (sequence) => {
	if (sequence.length < 1) {
		let newSequence = newSequenceHelper()
		return store.dispatch(setSequence(newSequence))
	}
}

const gameControllerSubscribe = () => {
	store.subscribe(() => {
		let {turn, level, sequence, player, strict, button} = store.getState()

		audioController(turn, sequence, level)
		buttonController(button)

		// if sequence is cleared, dispatch new sequence
		dispatchNewSequence(sequence)
	})
}

const initializeSimon = () => {
	let sequence = store.getState()
	dispatchNewSequence(sequence)
}
initializeSimon()
gameControllerSubscribe()

/*
 * React Presentational Components
 */

 const AudioComponents = () => {
	let sounds = [blueSound, yellowSound, redSound, greenSound]
	return (
		<div className='audio-components'>
			{sounds.map((thisSound, index) => (
				<audio key={index} id={'sound-' + index} src={sounds[index]} preload='auto'>
					<p>Your browser does not support the <code>audio</code> element.</p>
				</audio>
			))}
		</div>
	)
}

const GameButton = (props) => {
	let classes = 'game-button-' + props.id
	classes = (props.isActive) ? classes + ' active-button' : classes
	console.log(props.isActive)
	return <div className={classes} onClick={() => props.handleButtonClick(props.id)} />
}
GameButton.propTypes =  {
	id: PropTypes.number.isRequired,
	isActive: PropTypes.bool.isRequired,
	handleButtonClick: PropTypes.func.isRequired
}

const GameLayout = (props) => (
	<Grid>
		<Row>
			{props.button.map((bool, index) => (
				<Col key={index} xs={6}>
					<GameButton id={index} isActive={bool} handleButtonClick={props.handleButtonClick} />
				</Col>
			))}
		</Row>
	</Grid>
)
GameLayout.propTypes =  {
	button: PropTypes.array.isRequired,
	handleButtonClick: PropTypes.func.isRequired
}

const LevelCounter = (props) => (
	<Navbar.Text><strong>Level</strong> {props.level}</Navbar.Text>
)
LevelCounter.propTypes = {
	level: PropTypes.number.isRequired
}

const StrictButton = (props) => {
	if (props.strict === false) {
		return <NavItem onClick={props.handleStrictClick}><Glyphicon glyph='education' /> Difficulty: Normal</NavItem>
	} else {
		return <NavItem onClick={props.handleStrictClick} active><Glyphicon glyph='education' /> Difficulty: Hard</NavItem>
	}
}
StrictButton.propTypes =  {
	strict: PropTypes.bool.isRequired,
	handleStrictClick: PropTypes.func.isRequired
}

const PlayResetButton = (props) => {
	if (props.turn === 'off') {
		return <NavItem onClick={props.handlePlayClick}><Glyphicon glyph='play' /> Play</NavItem>
	} else {
		return <NavItem onClick={props.handleResetClick}><Glyphicon glyph='repeat' /> Restart</NavItem>
	}
}
PlayResetButton.propTypes =  {
	turn: PropTypes.string.isRequired,
	handlePlayClick: PropTypes.func.isRequired,
	handleResetClick: PropTypes.func.isRequired
}

const ControlBar = (props) => (
	<Navbar inverse collapseOnSelect fixedBottom>
    <Navbar.Header>
      <Navbar.Brand>
        Simon
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
    	<Nav>
      	<PlayResetButton
      		turn={props.turn}
      		handlePlayClick={props.handlePlayClick}
      		handleResetClick={props.handleResetClick} />
      	<StrictButton
					strict={props.strict}
      		handleStrictClick={props.handleStrictClick} />
				<LevelCounter
      		level={props.level} />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)
ControlBar.propTypes =  {
	turn: PropTypes.string.isRequired,
	level: PropTypes.number.isRequired,
	strict: PropTypes.bool.isRequired,
	handlePlayClick: PropTypes.func.isRequired,
	handleStrictClick: PropTypes.func.isRequired,
	handleResetClick: PropTypes.func.isRequired
}

/*
 * React-Redux Container Components
 */

const mapStateToProps = (state) => ({
	turn: state.turn,
	level: state.level,
	strict: state.strict
})

const mapDispatchToProps = (dispatch) => ({
	handlePlayClick: () => {
		dispatch(toggleTurn())
	},
	handleStrictClick: () => {
		dispatch(toggleStrict())
	},
	handleResetClick: () => {
		dispatch(clearAll())
	}
})

const ControlBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ControlBar)

const mapStateToPropsTwo = (state) => ({
	button: state.button
})

const mapDispatchToPropsTwo = (dispatch) => ({
	handleButtonClick: (id) => {
		dispatch(buttonClick(id))
	}
})

const GameLayoutContainer = connect(
	mapStateToPropsTwo,
	mapDispatchToPropsTwo
)(GameLayout)

const App = (props) => (
	<div className="App">
		<GameLayoutContainer />
		<ControlBarContainer />
	  <AudioComponents />
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
