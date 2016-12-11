import React from 'react';
import '../styles/UserInput.scss'
import Textarea from 'react-textarea-autosize';

//var defaultInput = "Heading\n=======\nSub-heading\n-----------\n### Another deeper heading\nParagraphs are separated\nby a blank line.\n\nLeave 2 spaces at the end of a line to do a  line break\nText attributes *italic*, **bold**,\n`monospace`, ~~strikethrough~~ .\n\nShopping list:\n\n* apples\n* oranges\n* pears\n\nNumbered list:\n\n1. apples\n2. oranges\n3. pears\n\nThe rain---not the reign---in\nSpain.\n\n*[Herman Fassett](https://freecodecamp.com/hermanfassett)*";

function UserInput(props) {
	return (
		<Textarea
      className="user-input"
      placeholder="Enter Markdown"
      //value={defaultInput}
      onChange={props.onUserInput} />
	)
}

export default UserInput;