import React from "react";
import api from "../lib/ApiClient";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const Subscription = ({ sub, removeSubscription }) => {
  const eventTypes = sub.event_types.map((eventType) => eventType.description);
  const eventString = eventTypes.join(", ") || "";

  const handleDelete = () => {
    api.deleteSubscription(sub.app_id, sub.id, removeSubscription);
  };

  return (
    <ListGroup.Item className="subscription-container">
      <div className="subscription-details">
        <ul horizontal  id="subscription-details-container">
          <li class="subscription-url">
            <h3>Url:</h3>
            <p>{sub.url}</p>
          </li>
          <li class="subscription-subscribed-to">
            <h3>Subscribed to:</h3>
            <p>{eventString}</p>
          </li>
          <li class="subscription-delete">
            <Button onClick={handleDelete}>Delete</Button>
          </li>
        </ul>
        {/* <ul className="subscription-details-container">
          <li>
            <h3>Url:</h3>
            <p>{sub.url}</p>
          </li>
          <li>
            <h3>Subscribed to:</h3>
            <p>{eventString}</p>
          </li>
        </ul> */}
      </div>
    </ListGroup.Item>
  );
};

export default Subscription;
