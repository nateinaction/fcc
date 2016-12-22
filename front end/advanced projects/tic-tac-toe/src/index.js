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
	status: null || 'win' || 'draw',
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

const setPlayer = (token) => ({
	type: 'SET_PLAYER',
	token
})

const setToken = (token, index) => ({
	type: 'SET_TOKEN',
	token,
	index
})

const tileClick = (index) => {
	return (dispatch, getState) => {
    const state = getState()
    let turn = state.turn
    let player = state.player

    if (turn === player) {
    	return dispatch(setToken(player, index))
    }
	}
}

/*
 * Redux Reducers
 */

const player = (state = null, action) => {
	switch (action.type) {
		case 'SET_PLAYER':
			return action.token
		case 'RESET':
			return null
		default:
			return state
	}
}

const turn = (state = 'x', action) => {
	switch (action.type) {
		case 'SET_TOKEN':
			return (state === 'x') ? 'o' : 'x'
		case 'RESET':
			return 'x'
		default:
			return state
	}
}

const gameBoard = (state = gameBoardInitialState(), action) => {
	switch (action.type) {
		case 'SET_TOKEN':
			return state.map((tile, index) => {
				if (index === action.index) {
					return action.token
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

//var thisGameBoard = [null,null,null,null,null,null,null,null,null] // empty
//var thisGameBoard = [null,null,null,null,'x',null,null,null,null] // center taken
//var thisGameBoard = ['o','x',null,'x','o',null,null,null,null] // win on next 'o' or block on next 'x'
//var thisGameBoard = ['x','x','o','x','o','o','o',null,null] // winning o
//var thisGameBoard = ['x','x','o','x','o','o',null,null,null] // two possible wins

const isEmpty = (currentGameBoard, index) => {
	return (currentGameBoard[index] === null)
}

const whichEmpty = (currentGameBoard, arr) => {
	return arr.filter((index) => isEmpty(currentGameBoard, index))
}

const chooseOutOf = (arr) => {
	let multiplier = arr.length
	let random = Math.floor(Math.random() * (multiplier + 1))
	return arr[random]
}

// count each item in the array
const countTokensInArr = (arr) => {
	let arrObjCount = {}
	arr.map((token) => {
		return arrObjCount[token] = arrObjCount[token] ? arrObjCount[token] + 1 : 1;
	})
	return arrObjCount
}

// using the current state of the gameboard, create a map of data about solutions
const solutionMap = (currentGameBoard) => {
	const solutions = [
		// horizontal wins
		[0,1,2],
		[3,4,5],
		[6,7,8],
		// vertical wins
		[0,3,6],
		[1,4,7],
		[2,5,8],
		// diaginal wins
		[0,4,8],
		[2,4,6]
	]
	return solutions.map((solution) => {
		let currentState = solution.map((location) => {
				return currentGameBoard[location]
			}).reduce(function(a, b) { 
	  		return a.concat(b);
			}, [])
		let tokenCount = countTokensInArr(currentState)
		return {
			solution,
			currentState,
			tokenCount
		}
	})
}
//console.log(solutionMap(thisGameBoard))

// eliminate solutions that are no longer winnable
const winnableSolutions = (currentGameBoard) => {
	let possibleSolutions = solutionMap(currentGameBoard)
	return possibleSolutions.filter((solutionObj) => {
		// if tempArray contains both x's and o's then remove from possibleWins array
		let tokenCount = solutionObj.tokenCount
		return !(tokenCount.hasOwnProperty('x') && tokenCount.hasOwnProperty('o'))
	})
}
//winnableSolutions(thisGameBoard)

const findPrimaryToken = (tokenCount) => {
	return tokenCount.hasOwnProperty('x') ? 'x' : 'o'
}

// eliminate solutions that are no longer winnable
const enhancedSolutionMap = (currentGameBoard) => {
	let possibleSolutions = winnableSolutions(currentGameBoard)
	return possibleSolutions.map((solutionObj) => {
		// add primaryToken and score keys
		let tokenCount = solutionObj.tokenCount
		let primaryToken = null
		let score = 0

		if (tokenCount['null'] !== 3) {
			primaryToken = findPrimaryToken(tokenCount)
			score = tokenCount[primaryToken]
		}
		return Object.assign({}, solutionObj, {
			primaryToken,
			score
	  })
	})
}
//enhancedSolutionMap(thisGameBoard)

const checkForScore = (score, possibleSolutions) => {
	return possibleSolutions.filter((solution) => {
		return (solution.score === score)
	})
}

const checkForWins = (possibleSolutions) => {
	let win = checkForScore(3, possibleSolutions)
	return (win.length > 0) ? findPrimaryToken(win[0].tokenCount) : false
}

const findNullSpot = (solutionObj) => {
	let location = solutionObj.currentState.indexOf(null)
	return solutionObj.solution[location]
}

const findTokenPossibleWins = (possibleSolutions, token) => {
	return checkForScore(2, possibleSolutions).filter((solutionsArr) => {
		return (solutionsArr.primaryToken === token)
	})
}

const findTokenPossibleMoves = (possibleSolutions, token) => {
	return checkForScore(1, possibleSolutions).filter((solutionsArr) => {
		return (solutionsArr.primaryToken === token)
	})
}

const chooseNextMove = (currentGameBoard, myToken) => {
	let possibleSolutions = enhancedSolutionMap(currentGameBoard)

	// find any wins (score of 3)
	let winningToken = checkForWins(possibleSolutions)
	if (winningToken) {
		return winningToken + ' wins!'
	}

	// find any battles (score of 2) place token on your own skirmish but then on opponents
	let opponentToken = (myToken === 'x') ? 'o' : 'x'
	let myPossibleWins = findTokenPossibleWins(possibleSolutions, myToken)
	let opponentPossibleWins = findTokenPossibleWins(possibleSolutions, opponentToken)
	if (myPossibleWins.length > 0) {
		return findNullSpot(myPossibleWins[0])
	} else if (opponentPossibleWins.length > 0) {
		return findNullSpot(opponentPossibleWins[0])
	}

	// find any skirmishes (score of 1), place token on your own skirmish
	let myPossibleMoves = findTokenPossibleMoves(possibleSolutions, myToken)
	if (myPossibleMoves.length > 0) {
		return findNullSpot(myPossibleMoves[0]) // For more variety I could build an array of null spots and hand them to chooseOutOf
	}

	// place token on center, if not available, on corners
	if (isEmpty(currentGameBoard, 4)) {
		return 4
	}

	let possibleMoves = whichEmpty(currentGameBoard, [0, 2, 6, 8])
	if (possibleMoves.length > 0) {
		let thisMove = chooseOutOf(possibleMoves)
		return thisMove
	}

	console.log('DRAW')
	return 'DRAW'
}
//chooseNextMove(thisGameBoard, 'x')

const ai = () => {
	store.subscribe(() => {
		let state = store.getState()
		let player = state.player
		let myToken = (player === 'x') ? 'o' : 'x'
		let turn = state.turn
		//let turnCount = state.turnCount
		let thisGameBoard = state.gameBoard

		//on every turn check for win

		//on every turn check for draw

		//on computer turn, choose move
		if (player !== null && myToken === turn) {
			console.log('ai plays')
			//setTimeout(console.log('ai plays'), 3000);
			let aiPlay = chooseNextMove(thisGameBoard, myToken)
      store.dispatch(setToken(myToken, aiPlay))
    }
	})
}
ai()

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
	    	<p>Select your game token. <Glyphicon glyph='remove' /> plays first.</p>
	      <SelectXButton onSetPlayer={props.handleSetPlayer} />
	      <SelectOButton onSetPlayer={props.handleSetPlayer} />
	    </Modal.Body>
	  </Modal>
	)
}

const tileClass = (tile) => {
	if (tile === 'x') {
		return 'tile-x .glyphicon .glyphicon-remove'
	} else if (tile === 'o') {
		return 'tile-o .glyphicon .glyphicon-unchecked'
	}
	return 'tile-blank'
}

const GameBoard = (props) => (
	<div id='game-board'>
	{props.gameBoard.map((tile, index) => {

		return (
			<div
				key={index}
				className={tileClass(tile)}
				onClick={() => props.handleTileClick(index)} />
		)
	})}
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
	handleSetPlayer: (token) => {
		dispatch(setPlayer(token))
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

/*
 * Redux state to console log
 */

console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))

/*
store.dispatch(setPlayer('x'))
store.dispatch(tileClick(0))
*/
