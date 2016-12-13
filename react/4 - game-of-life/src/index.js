import { createStore, combineReducers } from 'redux'
import React, { Component, PropTypes } from 'react';
import { Provider, connect } from 'react-redux'
import { render } from 'react-dom';
//import uuidV4 from 'uuid/v4';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import './index.scss';

/*
{
	play: true,
	generation: 0,
	speed: 1000,
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

const speed = (state = 500, action) => {
	switch (action.type) {
		default:
			return state
	}
}

const gameOfLifeApp = combineReducers({
	play,
	generation,
	speed
})

/*
 * Redux Store
 */

let store = createStore(gameOfLifeApp)

/*
 * React Presentational Components
 */

const GameTile = (props) => (
	<div className='game-tile' />
)

const GameBoard = (props) => (
	<div className='game-board'>
		{props.tiles.map((tile, index) => {
			if (tile === 'adult') {
				return <GameTile className='adult' />
			} else if (tile === 'child') {
				return <GameTile className='child' />
			} else {
				return <GameTile className='dead' />
			}
		})}
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
	componentDidMount() {
		//this.generationTimer = setInterval(this.props.handleNextGeneration, this.props.speed);
	}

	componentWillUnmount() {
		clearInterval(this.generationTimer)
	}

	render() {
		if (this.props.play) {
			clearInterval(this.generationTimer)
			this.generationTimer = setInterval(this.props.handleNextGeneration, this.props.speed);
		} else {
			clearInterval(this.generationTimer)
		}
		return <Navbar.Text><strong>Generation:</strong> {this.props.generation}</Navbar.Text>
	}
}
GenerationControl.propTypes =  {
	play: PropTypes.bool.isRequired,
	speed: PropTypes.number.isRequired,
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
      	speed={props.speed}
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
	speed: state.speed,
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

/*
 * React Root Component
 */

const App = (props) => (
	<ControlBarContainer />
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
