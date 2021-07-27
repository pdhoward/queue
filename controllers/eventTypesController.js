const EventType = require("../models/eventType");
const { validationResult } = require("express-validator");

const getEventTypes = (req, res, next) => {
  const errors = validationResult(req);
  console.log(`-------get event types------`)
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  EventType.find({ app_id: req.params.app_id })
    .then((eventTypes) => {
      console.log(`retrieved events types`)
      console.log(req.params.app_id)
      console.log(JSON.stringify(eventTypes))
      res.json(eventTypes);
    })
    .catch((error) => console.log(error));
};

const createEventType = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const app_id = req.params.app_id;
  const description = req.body.description;

  EventType.create({ app_id, description })
    .then((eventType) => {
      res.json(eventType);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getEventTypes = getEventTypes;
exports.createEventType = createEventType;
