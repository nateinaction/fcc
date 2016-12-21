import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
//import React, { PropTypes } from 'react';
//import { Provider, connect } from 'react-redux'
//import { render } from 'react-dom';
//import { PageHeader, Navbar, Nav, NavItem, Glyphicon, ProgressBar, Modal, FormGroup, ControlLabel, FormControl, Button, InputGroup } from 'react-bootstrap';
//import './index.scss';

/*
 * Example Object
 */
/*
{
	player: null || 'x' || 'o',
	turn: 'x' || 'o',
	turnCount: 0,
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

const setPlayer = (piece) => ({
	type: 'SET_PLAYER',
	piece
})

const setPiece = (piece, index) => ({
	type: 'SET_PIECE',
	piece,
	index
})

const tileClick = (index) => {
	return (dispatch, getState) => {
    const state = getState()
    let turn = state.turn
    let player = state.player

    if (turn === player) {
    	return dispatch(setPiece(player, index))
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
		case 'SET_PIECE':
			return (state === 'x') ? 'o' : 'x'
		case 'RESET':
			return 'x'
		default:
			return state
	}
}

const turnCount = (state = 0, action) => {
	switch (action.type) {
		case 'SET_PIECE':
			return state + 1
		case 'RESET':
			return 0
		default:
			return state
	}
}

const gameBoard = (state = gameBoardInitialState(), action) => {
	switch (action.type) {
		case 'SET_PIECE':
			return state.map((tile, index) => {
				if (index === action.index) {
					return action.piece
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
	turnCount,
	gameBoard
})

/*
 * Redux Store
 */

let store = createStore(ticTacToeApp, applyMiddleware(thunk))

/*
 * Helper Fns
 */

const isEmpty = (thisGameBoard, index) => {
	return (thisGameBoard[index] === null)
}

const whichEmpty = (thisGameBoard, arr) => {
	return arr.filter((index) => isEmpty(thisGameBoard, index))
}

const chooseOutOf = (arr) => {
	let multiplier = arr.length
	let random = Math.floor(Math.random() * (multiplier + 1))
	return arr[random]
}

//const thisGameBoard = [null,null,null,null,null,null,null,null,null] // empty
const thisGameBoard = [null,null,null,null,'x',null,null,null,null] // center taken
//const thisGameBoard = ['x','x','o','x','o','o',null,null,null] // two possible wins
//const thisGameBoard = ['x','x','o','x','o','o','o',null,null] // winning o
const possibleWins = [
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

const eliminateImpossibleWins = (thisGameBoard, possibleWins) => {
	return possibleWins.filter((possibleWin) => {

		// create an array of possible win spaces from gameboard
		let tempArray = possibleWins.map((possibleWin) => {
			let location = possibleWin[n]
			return thisGameBoard[location]
		})

		// if tempArray contains both x's and o's then remove from possibleWins array
		return !(tempArray.indexOf('x') !== -1 && tempArray.indexOf('o') !== -1)
		
	})
}

const nextMove = (thisGameBoard, possibleWins, myPiece) => {

	let winningPiece = null;

	let possibleMoves = possibleWins.filter((possibleWin) => {
		// create an array of possible win spaces from gameboard
		let tempArray = [];
		for (var n = 0; n < 3; n++) {
			let location = possibleWin[n]
			let piece = thisGameBoard[location]
			tempArray.push(piece)
		}

		// if tempArray contains both x's and o's then remove from possibleWins array
		if (tempArray.indexOf('x') !== -1 && tempArray.indexOf('o') !== -1) {
			console.log('removing ', possibleWin, ' from array of possible wins')
			return false
		}
		return true
	})

	possibleMoves = possibleMoves.filter((possibleWin) => {
		// create an array of possible win spaces from gameboard
		let tempArray = [];
		for (var n = 0; n < 3; n++) {
			let location = possibleWin[n]
			let piece = thisGameBoard[location]
			tempArray.push(piece)
		}

		// count instances of each piece in array
		let tempObj = {}
		for (var n = 0; n < 3; n++) {
			var piece = tempArray[n];
    	tempObj[piece] = tempObj[piece] ? tempObj[piece] + 1 : 1;
		}

		// find any wins ...
		if (tempObj['x'] === 3) {
			console.log(possibleWin, ' has 3 identical pieces')
			winningPiece = 'x'
			return false
		}
		if (tempObj['o'] === 3) {
			console.log(possibleWin, ' has 3 identical pieces')
			winningPiece = 'o'
			return false
		}

		//if the temp array contains two of the same pieces return the array
		if (tempObj['x'] === 2 || tempObj['o'] === 2) {
			console.log(possibleWin, ' has 2 identical pieces')
			return true
		}
		return false
	})

	// if there is a win, report it.
	if (winningPiece !== null) {
		console.log(winningPiece, ' won!')
	}

	let numOfPossibleMoves = possibleMoves.length
	// if there is are multiple arrays with 2 identical pieces, pick the AI's
	if (numOfPossibleMoves > 1) {
		console.log('possible moves is greater than 1')
		for (var n = 0; n < numOfPossibleMoves; n++) {
			console.log(possibleMoves[n], myPiece, possibleMoves[n].indexOf(myPiece))
			if (possibleMoves[n].indexOf(myPiece) !== -1) {
				let thisMove = whichEmpty(thisGameBoard, possibleMoves[n])
				console.log('I choose ', thisMove)
				return thisMove
			}
		}
	}
	// if an array with two identical pieces return the move index
	if (numOfPossibleMoves === 1) {
		console.log('possible moves is 1')
		let thisMove = whichEmpty(thisGameBoard, possibleMoves)
		console.log('I choose ', thisMove)
		return thisMove
	}
	// if there are not two identical pieces i.e. if 'move' is an empty array then pick one of 4 corners or center with center being priority
	if (numOfPossibleMoves === 0) {
		if (isEmpty(thisGameBoard, 4)) {
			console.log('I choose ', 4)
  		return 4
  	} else {
  		let possibleMoves = whichEmpty(thisGameBoard, [0, 2, 6, 8])
  		let thisMove = chooseOutOf(possibleMoves)
  		console.log('I choose ', thisMove)
  		return thisMove
  	}
	}
}

nextMove(thisGameBoard, possibleWins, 'x')

const ai = () => {
	store.subscribe(() => {
		let state = store.getState()
		let player = state.player
		let piece = (player === 'x') ? 'o' : 'x'
		let turn = state.turn
		let turnCount = state.turnCount
		let thisGameBoard = state.gameBoard
		if (player !== null && piece === turn) {
			console.log('ai plays')
			//setTimeout(console.log('ai plays'), 1000);
      // if player has NOT gone, choose one of the corners OR the center [0, 2, 3, 5, 6, 8, 4]
      if (turnCount === 0) {
      	let aiPlay = chooseOutOf([0, 2, 3, 4, 5, 6, 8])
      	store.dispatch(setPiece(piece, aiPlay))
      }
      // if player has gone once, place into center [4] if unavailable, place into corner [0, 2, 3, 5, 6, 8]
      if (turnCount === 1) {
      	if (isEmpty(thisGameBoard, 4)) {
      		store.dispatch(setPiece(piece, 4))
      	} else {
      		let aiPlay = chooseOutOf([0, 2, 3, 5, 6, 8])
      		store.dispatch(setPiece(piece, aiPlay))
      	}
      }
      // if player has gone MORE THAN once then look for instances of two in a row
      if (turnCount > 1) {

      }
    }
	})
}
ai()

/*
 * Redux state to console log
 */
/*
console.log('initial state')
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))
*/
/*
store.dispatch(setPlayer('x'))
store.dispatch(tileClick(0))
*/
