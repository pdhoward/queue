const Event = require("../models/event");
const { validationResult } = require("express-validator");

const createEvent = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Event.create(req.body)
    .then((event) => {
      req.event = event;
      next();
    })
    .catch((error) =>
      console.log("Error while creating event ${req.body.topic}")
    );
};

exports.createEvent = createEvent;
