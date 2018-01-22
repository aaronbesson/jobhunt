import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  firebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';

import firebase, { auth, provider } from '../../../firebase.js';
import OneCol from '../../templates/OneCol';
import { Checkout } from '../../organisms';
import { UserAuth } from '../../molecules';

const defaultFormState = {
  apply: null,
  description: null,
  location: null,
  range: null,
  remote: null,
  title: null,
};

class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      ...defaultFormState
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleQuillChange = this.handleQuillChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postJob = this.postJob.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  handleQuillChange(value) {
    this.setState({ 'description': value });
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.postJob();
  }

  clearForm() {
    this.setState(defaultFormState);
  }

  postJob() {
    const { description, title, remote, range, location, apply } = this.state;
    firebase.push('jobs', {
      apply,
      description,
      title,
      remote: remote === 'on' ? true : false,
      range,
      location,
      timestamp: -Date.now()
    });
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }

  renderLogin() {
    return (
      <Col>
        <h4>Information:</h4>
        <Row>
          <Col>
            <p>In order to post a job on this board you will need to</p>
            <ol>
              <li>Login with a google account</li>
              <li>Add a payment type</li>
              <li>Fillout the post info and submit the payment</li>
            </ol>
          </Col>
          <Col>
            <p>All transactions are handled with Stripe</p>
            <p>This site does not store any payment information, all though you can save your payment information via Stripe</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Post information</h5>
            <p>There are 2 types of posts, normal and featured.</p>
            <p>You will have the option to select which type of post when filling out the post information</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Normal post sample</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Featured post sample</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <UserAuth type="login" />
          </Col>
        </Row>
      </Col>
    );
  }

  renderPost() {
    return (
      <Col>
        <Row className="mb-5">
          <Col>
            <h3>Job Post Information</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="job-title">Job Title</Label>
                <Input type="text" name="title" id="job-title" onChange={this.handleChange} placeholder="My great Job Title" />
                <FormText color="muted">
                  Something that is a catchy but descriptive
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label for="description">Job Description</Label>
                <ReactQuill id="description" value={this.state.description}
                  onChange={this.handleQuillChange} />
                <FormText color="muted">
                  Build out the fill details within this area, everything that
                  you put here will be displayed on the job post detail page.
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label for="apply">Apply Link</Label>
                <Input type="text" name="apply" id="apply" onChange={this.handleChange} placeholder="http://www.CoolCompany.com/jobs/apply" />
                <FormText color="muted">
                  Fully formed urls only
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label for="range">Salary Range</Label>
                <Input type="text" name="range" id="range" onChange={this.handleChange} placeholder="50k - 75k" />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="remote" onChange={this.handleChange} />
                  <span>Remote OK?</span>
                </Label>
              </FormGroup>
              <FormGroup>
                <Label for="location">Location</Label>
                <Input type="text" name="location" id="location" onChange={this.handleChange} placeholder="New York, NY" />
                <FormText color="muted">
                  This is only shown if remote is not checked
                </FormText>
              </FormGroup>
              <FormGroup>
                <Button>Submit</Button>
              </FormGroup>
            </Form>


          </Col>
        </Row>
      </Col>
    );
  }

            //<CheckoutV
              //name={'Job Post'}
              //description={'Normal Job Post'}
              //amount={10}
            ///>

  render() {
    const { user } = this.state;
    let postRenderer = this.renderLogin();
    if (user) {
       postRenderer = this.renderPost();
    }
    return (
      <OneCol>
        {postRenderer}
      </OneCol>
    );
  }
}

const mstp = ({userStore}) => {
  return {
    user: userStore.user
  };
}

export default compose(
  firebaseConnect(),
  connect(mstp)
)(Post);

//export default connect(mstp)(Post);
