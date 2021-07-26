import React from "react";
import api from "../lib/ApiClient";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const SelectEvents = ({ addToSubscriptions, eventTypes, app_id }) => {
  const handleNewSubscription = (e) => {
    e.preventDefault();
    const parentForm = e.target;
    const formInputs = Array.from(parentForm.elements);
    const newSubscription = { app_id, event_types: [] };

    formInputs.forEach((element) => {
      if (element.name === "secret" && element.value !== "") {
        console.log("secret", element.value);
        newSubscription.signingSecret = element.value;
      } else if (element.name === "endpoint") {
        console.log("endpoint", element.value);
        newSubscription.url = element.value;
      } else if (element.type === "checkbox" && element.checked) {
        newSubscription.event_types.push(element.value);
      }
    });

    api.addSubscription(app_id, newSubscription, (newSub) =>
      addToSubscriptions(newSub)
    );

    parentForm.reset();
  };

  return (
    <Container fluid id="register-endpoint-container">
      <Row><h2>Register Subscription:</h2></Row>
      <Row>
        <Form id="register-endpoint-form" onSubmit={handleNewSubscription}>
          <Form.Group controlId="formAddEndpoint">
            <Form.Label>
              Enter the endpoint you'd like us to send event notifications to:
            </Form.Label>
            <Form.Control
              type="text"
              id="endpoint"
              name="endpoint"
              placeholder="https://yourwebsite.com/yourendpoint"
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formAddSecret">
            <Form.Label>
              Enter the secret you'd like to use (optional):
            </Form.Label>
            <Form.Control
              type="text"
              id="secret"
              name="secret"
              placeholder="yourSecret"
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formSelectEventTypes">
            <Form.Label>
              Select which events you'd like us to notify you about:
            </Form.Label>
            <ul id="event-selection-list">
              {eventTypes.map((eventType) => (
                <li key={eventType.id}>
                  <Form.Check
                    type="checkbox"
                    label={eventType.description}
                    name={eventType.description}
                    value={eventType.id}
                  />
                </li>
              ))}
            </ul>
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Row>
    </Container>
  );
};

export default SelectEvents;
