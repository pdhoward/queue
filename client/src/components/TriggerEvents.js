import React from "react";
import api from "../lib/ApiClient";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const TriggerEvents = ({ eventTypes, app_id }) => {

  console.log(`----entered trigger events ------`)
  console.log(eventTypes)
  
  const handleNewHook = (e) => {
    e.preventDefault();
    const newEvent = {
      app_id,
      event_type: e.target.value,
      affected_resource: e.target.name,
      payload: {
        msg:
          "Custom payload for this event, specified by the customer.  Could be any JSON object",
      },
    };

    api.notifySubscribers(app_id, newEvent);
  };

  if (eventTypes.length === 0) {
    return null;
  }

  return (
    <Container fluid>
      <Row><h2>Trigger an event by pressing a button below:</h2></Row>
      <Row>
        <ul id="event-button-container">
          {eventTypes.map((eventType) => (
            <li key={eventType.id}>
              <Button
                name={eventType.description}
                onClick={handleNewHook}
                value={eventType.id}
              >
                {eventType.description}
              </Button>
            </li>
          ))}
        </ul>
      </Row>
    </Container>
  );
};

export default TriggerEvents;
