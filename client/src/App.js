import React, { useEffect, useState } from "react";
import api from "./lib/ApiClient";
import TriggerEvents from "./components/TriggerEvents";
import SelectEvents from "./components/SelectEvents";
import Subscriptions from "./components/Subscriptions";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// this is hard-coded for testing
const APP_ID = "6074c0d2f8bc834cf9fb5729";

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    api.getSubscriptions(APP_ID, setSubscriptions);
  }, []);

  useEffect(() => {
    api.getEventTypes(APP_ID, setEventTypes);
  }, []);

  const addToSubscriptions = (newSubscription) => {
    setSubscriptions([...subscriptions, newSubscription]);
  };

  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <Container fluid id="entire-page">
      <h1>Queue Hooks</h1>
      <Container fluid id="entire-section">
        <Row id="trigger-events">
          <TriggerEvents eventTypes={eventTypes} app_id={APP_ID} />
        </Row>
        <Row id="add-subscription">
          <SelectEvents
            addToSubscriptions={addToSubscriptions}
            eventTypes={eventTypes}
            app_id={APP_ID}
          />
        </Row>
        <Row id="show-subscription">
          <Subscriptions
            subscriptions={subscriptions}
            removeSubscription={removeSubscription}
          />
        </Row>
      </Container>
    </Container>
  );
}

export default App;
