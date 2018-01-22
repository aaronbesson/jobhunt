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
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Badge,
  Media
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
    this.state = {
      modal: false
    };
    this.toggle = this.toggle.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //dispatch(fetchJobs());
  }

  onModalOpen(evt) {
    debugger;
    this.toggle(evt.currentTarget.id);
  }

  toggle(modalName) {
    let value = true;
    if (this.state.hasOwnProperty(modalName)) {
     value = !this.state[modalName];
    }

    this.setState({
      [modalName]: value
    });
  }

  createMarkup(content) {
    return {__html: content};
  };

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
              <ListGroupItem key={item.key}>
                <Row id={item.key} onClick={this.toggle.bind(this, item.key)}>
                  <Col md='1'>
                    <Media left>
                      <Media object src="http://lorempixel.com/64/64/city/" alt="Generic placeholder image" />
                    </Media>
                  </Col>
                  <Col>
                    <Row>
                      <Col>{item.value.title}</Col>
                    </Row>
                    <Row>
                      <Col>{item.value.remote ? (<Badge color="secondary">Remote</Badge>) : null}</Col>
                      <Col>{item.value.location}</Col>
                      <Col>{item.value.range}</Col>
                    </Row>
                    {/*<Col><Button><a href={item.value.apply}>Apply</a></Button></Col>*/}
                    <Modal labelledBy={item.key} isOpen={this.state[item.key]} toggle={this.toggle.bind(this, item.key)} className={this.props.className}>
                      <ModalHeader toggle={this.toggle.bind(this, item.key)}>{item.value.title}</ModalHeader>
                      <ModalBody>
                        <div dangerouslySetInnerHTML={this.createMarkup(item.value.description)} />
                      </ModalBody>
                      <ModalFooter>
                        <a href={item.value.apply} target='_blank'><Button color="primary" >Apply</Button></a>{' '}
                        <Button color="secondary" onClick={this.toggle.bind(this, item.key)}>Close</Button>
                      </ModalFooter>
                    </Modal>
                  </Col>
                </Row>
              </ListGroupItem>
            )
          }
        );
    return (
      <OneCol>
        <Row>
          <Col>
            <h3>Job Posts</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
            {jobs}
            </ListGroup>
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
