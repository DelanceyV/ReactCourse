import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Label,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components";

const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  };

  handleSubmit = (values) => {
    this.props.postComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
    // console.log("current state is: " + JSON.stringify(values));
    // alert("Current state is: " + JSON.stringify(values));
  };

  render() {
    return (
      <>
        <Row className="form-group">
          <Col md={{ size: 10, offset: 2 }}>
            <Button outline type="submit" onClick={this.toggleModal}>
              <span className="fa fa-pencil fa-lg" /> Submit Comment
            </Button>
          </Col>
        </Row>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit a Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <div className="form-group">
                <Label htmlFor="rating" md={2}>
                  Rating
                </Label>

                <Control.select
                  model=".rating"
                  id="rating"
                  name="rating"
                  // validators=
                >
                  <option value="" selected disabled>
                    Select Rating...
                  </option>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </Control.select>
              </div>
              <div className="form-group">
                <Control.text
                  model=".author"
                  id="author"
                  name="author"
                  placeholder="First and Last Name"
                  className="form-control"
                  validators={{
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  component="div"
                  messages={{
                    minLength: "Must be at least 2 characters",
                    maxLength: "Must be 15 characters or less",
                  }}
                />
              </div>
              <div className="form-group">
                <Control.textarea
                  model=".text"
                  id="text"
                  name="text"
                  rows="6"
                  placeholder="Comments"
                  className="form-control"
                />
              </div>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <FadeTransform
        in
        transformProps={{
          exitTransform: "scale(0.5) translateY(-50%)",
        }}
      >
        <Card>
          <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
          <CardBody>
            <CardText>{campsite.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>
  );
}

function RenderComments({ comments, postComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        <Stagger in>
          {comments.map((comment) => {
            return (
              <Fade in key={comment.id}>
                <div>
                  {comment.text}
                  <p className="mb-3">
                    -- {comment.author}{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(Date.parse(comment.date)))}
                  </p>
                </div>
              </Fade>
            );
          })}
        </Stagger>
        <CommentForm campsiteId={campsiteId} postComment={postComment} />
      </div>
    );
  }
  return <div />;
}

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="constiner">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  }
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            postComment={props.postComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  } else {
    return <div />;
  }
}

export default CampsiteInfo;
