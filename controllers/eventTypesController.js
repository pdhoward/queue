var ObjectId = require('mongoose').Types.ObjectId;
const EventType = require("../models/eventType");
const { validationResult } = require("express-validator");

const getEventTypes = async (req, res, next) => {
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let parm = req.params.app_id.trim()
  let result = await EventType.find({app_id: ObjectId(parm)}) 
  res.json(result);  
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
