const axios = require("axios");
const priorityQueue = require("async/priorityQueue");
const Message = require("../models/message");

const MAX_RETRY_ATTEMPTS = 5;
const POST_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  maxRedirects: 0,
};

let queue;

const initializePriorityQueue = () => {
  console.log("Initializing priority queue");
  queue = priorityQueue(worker, 10);
};

const push = (rawEvent, callback) => {
  queue.push(rawEvent, callback);
};

const worker = async (msgData, callback) => {
  const timeout = calculateDelay(msgData);

  setTimeout(() => {
    msgData.sentAt = new Date();
    const { url, signature, ...validData } = msgData;

    Message.create(validData)
      .then((msg) => {
        msgData.id = msg._id;
        console.log(`Sending message ${msgData.id}...`);
        sendMessage(msgData);
      })
      .catch((error) => console.log(error));
  }, timeout);
};

const sendMessage = (msgData) => {
  const config = extractConfig(msgData);

  axios
    .post(msgData.url, msgData.payload, config)
    .then((res) => handleSuccessfulDelivery(msgData, res))
    .catch((res) => handleFailedDelivery(msgData, res));
};

const handleSuccessfulDelivery = async (msgData, res) => {
  const { responseData, requestData } = extractRequestAndResponse(res);
  const newProps = {
    requestData,
    responseData,
    deliveredAt: new Date(),
    deliveryState: true,
  };

  console.log(`Message ${msgData.id} confirmed received`);
  await Message.findByIdAndUpdate(msgData.id, newProps, { new: true });
};

const handleFailedDelivery = (msgData, res) => {
  const { responseData, requestData } = extractRequestAndResponse(res);
  const newProps = { responseData, requestData };

  if (msgData.deliveryAttempt < MAX_RETRY_ATTEMPTS) {
    console.log(`Message ${msgData.id} failed, retrying...`);
  } else {
    console.log(
      `Message ${msgData.id} failed.  Reached max of 5 retries for message ${msgData.id}.`
    );
  }

  updateDatabaseOnFail(msgData, newProps);
};

const updateDatabaseOnFail = async (msgData, newProps) => {
  Message.findByIdAndUpdate(msgData.id, newProps, { new: true })
    .then(() => {
      if (msgData.deliveryAttempt < MAX_RETRY_ATTEMPTS) {
        msgData.deliveryAttempt += 1;
        queue.push(msgData, pushCallback);
      }
    })
    .catch((error) => console.log(error));
};

const pushCallback = (msgData) => {
  console.log(
    `error while adding message ${msgData.id || ""} back into message queue`
  );
};

const calculateDelay = (msgData) => 2 ** msgData.deliveryAttempt * 1000;

const extractRequestAndResponse = (res) => {
  const requestData = res.config;
  const responseData = {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    data: res.data,
  };

  return { responseData, requestData };
};

const extractConfig = (msgData) => {
  const config = { ...POST_CONFIG };
  config.headers = {
    ...config.headers,
    "x-team4hook-app_id": msgData.app_id,
    "x-team4hook-subscription_id": msgData.subscription_id,
    "x-team4hook-event_id": msgData.event_id,
    "x-team4hook-event_type": msgData.event_type,
    "x-team4hook-message_id": msgData.id,
    "x-team4hook-delivery_attempt": msgData.deliveryAttempt,
  };

  if (msgData.signature) {
    config.headers["x-team4Hook-signature"] = msgData.signature;
  }

  return config;
};

exports.initializePriorityQueue = initializePriorityQueue;
exports.push = push;
