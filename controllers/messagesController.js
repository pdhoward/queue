const Message = require("../models/message");
const queue = require("./queueController");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const getMessages = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Message.find({ app_id: req.params.app_id })
    .then((msgs) => res.json({ msgs }))
    .catch((error) => console.log(error));
};

const createMessages = (req, res, next) => {
  console.log(`Sending message to ${req.subscribers.length} subscriber(s)...`);
  const basicData = extractMsgData(req);

  req.subscribers.forEach(({ id, url, secret }) => {
    const msgData = { ...basicData, subscription_id: id, url };

    if (secret) {
      msgData.signature = calculateSignature(basicData.payload, secret);
    }

    queue.push(msgData, (error) => {
      console.log("error while adding message to message queue");
    });
  });

  res.sendStatus(200);
};

const extractMsgData = (req) => {
  return {
    app_id: req.params.app_id,
    event_id: req.event.id,
    event_type: req.event.event_type,
    deliveryAttempt: 1,
    deliveryState: false,
    payload: req.event.payload,
  };
};

const calculateSignature = (payload, secret) => {
  const hmac = crypto.createHmac("sha256", secret);

  if (typeof payload !== "string") {
    payload = JSON.stringify(payload);
  }

  hmac.update(payload);
  return hmac.digest("hex");
};

exports.getMessages = getMessages;
exports.createMessages = createMessages;
