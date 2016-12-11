import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PageHeader, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import './index.scss';

function getThirtyDays() {
  return axios.get('https://fcctop100.herokuapp.com/api/fccusers/top/recent')
}

function getAllTime() {
  return axios.get('https://fcctop100.herokuapp.com/api/fccusers/top/alltime')
}

function getApiData() {
  var thirtyDays = getThirtyDays(),
      allTime = getAllTime();
  return axios.all([thirtyDays, allTime])
    .catch(err => console.warn('Error in getPlayersInfo: ', err));
}

function CamperLink(props) {
  return (
    <a href={'https://www.freecodecamp.com/' + props.username}>
      {props.children}
    </a>
  )
}

function CamperImage(props) {
  return (
    <img src={props.img} alt={props.username + "'s avatar"} />
  )
}

function CamperName(props) {
  return (
    <span>{props.username}</span>
  )
}

function Camper(props) {
  return (
    <tr>
      <td>{props.count}</td>
      <td className='user-meta'>
        <CamperLink username={props.camper.username}>
          <CamperImage img={props.camper.img} username={props.camper.username} />
          <CamperName username={props.camper.username} />
        </CamperLink>
      </td>
      <td>{props.camper.recent}</td>
      <td>{props.camper.alltime}</td>
    </tr>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        thirtyDays: [],
        allTime: [],
        selection: []
      },
      isLoading: true
    };
    this.handleThirtyDays = this.handleThirtyDays.bind(this);
    this.handleAllTime = this.handleAllTime.bind(this);
  }

  componentDidMount() {
    getApiData().then(data => {
      this.setState({
        data: {
          thirtyDays: data[0].data,
          allTime: data[1].data,
          selection: data[0].data
        },
        isLoading: false
      })
    })
  }

  handleThirtyDays() {
    this.setState({
      data: {
        thirtyDays: this.state.data.thirtyDays,
        allTime: this.state.data.allTime,
        selection: this.state.data.thirtyDays
      }
    })
  }

  handleAllTime() {
    console.log(this.state.data.allTime)
    this.setState({
      data: {
        thirtyDays: this.state.data.thirtyDays,
        allTime: this.state.data.allTime,
        selection: this.state.data.allTime
      }
    })
  }

  render() {
    const data = this.state.data.selection;

    return (
      <div className="App">
        <PageHeader>React freeCodeCamp Leaderboard</PageHeader>
        <Col xs={12}>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th className='camper-count'>#</th>
                <th>Camper Name</th>
                <th className='sortable-header' onClick={this.handleThirtyDays}>Points in past 30 days</th>
                <th className='sortable-header' onClick={this.handleAllTime}>All time points</th>
              </tr>
            </thead>
            <tbody>
             {data.map((camper, index) => <Camper key={camper.username} count={index + 1} camper={camper} />)}
            </tbody>
          </Table>
        </Col>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
