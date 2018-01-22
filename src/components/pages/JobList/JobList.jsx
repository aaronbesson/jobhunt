import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  firebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase';

import {
  Row,
  Col,
  Button
} from 'reactstrap';
import { RingLoader } from 'react-spinners';

import OneCol from '../../templates/OneCol';
import firebase from '../../../firebase';

import {
  fetchJobs
} from '../../../actions/jobs';

class JobList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //dispatch(fetchJobs());
  }

  render() {
    //const sampleTodo = { timestamp: -Date.now(), title: 'Job ' + Date.now(), remote: (Date.now() % 2 == 0), location: 'new york, NY', contact: 'jim@fakejob.com' }
    //const pushSample = () => firebase.push('jobs', sampleTodo)
    const jobs = !isLoaded(this.props.jobs) ?
      <RingLoader loading color="#36D7B7" /> :
      isEmpty(this.props.jobs) ?
        'Jobs list is empty' :
        this.props.jobs.map(
          (item) => {
            return (
              <Row id={item.key} key={item.key}>
                <Col>{item.value.title}</Col>
                <Col>Remote: {item.value.remote ? 'true':'false'}</Col>
                <Col>{item.value.location}</Col>
                <Col>{item.value.range}</Col>
                <Col><Button><a href={item.value.apply}>Apply</a></Button></Col>
              </Row>
            )
          }
        );
    return (
      <OneCol>
        <Row>
          <Col>
            <p>Job List</p>
          </Col>
        </Row>
        <Row>
          <Col>
            {jobs}
          </Col>
        </Row>
      </OneCol>
    )
  }
}

const mstp = ({ firebase }) => {
  let jobs = [];
  if (firebase.ordered.hasOwnProperty('jobs')) {
    jobs = firebase.ordered.jobs;
  }
  return {
    jobs,
  };
}

export default compose(
  firebaseConnect(props => [{ path: 'jobs', queryParams: [ 'limitToFirst=10', 'orderByChild=timestamp' ] }]),
  connect(mstp)
)(JobList);
