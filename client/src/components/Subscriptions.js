import React from "react";
import Subscription from "./Subscription";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const Subscriptions = ({ subscriptions, removeSubscription }) => {
  return (
    <Container fluid id="existing-endpoint-container">
      <Row><h2>Registered Subscriptions:</h2></Row>
      <Row>
        <ListGroup id="endpoint-list-container">
          {subscriptions.map((sub) => (
            <Subscription
              key={sub.id}
              sub={sub}
              removeSubscription={removeSubscription}
            />
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
};

export default Subscriptions;


