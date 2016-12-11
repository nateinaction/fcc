import React, { Component } from 'react';
import { PageHeader, Col } from 'react-bootstrap';
import './App.scss';
import UserInput from './components/UserInput';
import MarkdownPreview from './components/MarkdownPreview';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {markdown: ''};

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(e) {
    e.preventDefault();
    this.setState({
      markdown: e.target.value
    })
  }

  render() {
    const markdown = this.state.markdown;

    return (
      <div className="App">
        <PageHeader>React Markdown Previewer</PageHeader>
        <Col xs={12} md={5} mdOffset={1}>
          <UserInput
            onUserInput={this.handleUserInput} />
        </Col>
        <Col xs={12} md={5} mdOffset={1}>
          <MarkdownPreview
            markdown={markdown} />
        </Col>
      </div>
    );
  }
}

export default App;
