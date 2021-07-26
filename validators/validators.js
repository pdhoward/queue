const { param } = require("express-validator");
const App = require("../models/app");
const EventType = require("../models/eventType");
const Sub = require("../models/subscription");

const validateApp = param("app_id")
  .exists()
  .custom((id) => {
    return App.exists({ _id: id }).then((app) => {
      if (!app) {
        throw new Error("App does not exist.");
      }
    });
  });

const validateEventType = param("event_id")
  .exists()
  .custom((id) => {
    return EventType.exists({ _id: id }).then((eventType) => {
      if (!eventType) {
        throw new Error("Event type does not exist.");
      }
    });
  });

const validateSubscription = param("sub_id")
  .exists()
  .custom((id) => {
    return Sub.exists({ _id: id }).then((subscription) => {
      if (!subscription) {
        throw new Error("Subscription does not exist.");
      }
    });
  });

exports.validateApp = validateApp;
exports.validateSubscription = validateSubscription;
exports.validateEventType = validateEventType;
