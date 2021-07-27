const Subscription = require("../models/subscription");
const axios = require("axios");
const { validationResult } = require("express-validator");

const createSubscription = async (req, res, next) => {
  console.log(`----entered create subscription----`)
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = await Subscription.create(req.body);
    const subscription = await Subscription.findById(id).populate(
      "event_types"
    );
    await pingNewEndpoint(subscription, req.params.app_id);
    res.json(subscription);
  } catch (error) {
    console.log(error);
  }
};

const pingNewEndpoint = async (subscription, app_id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-team4hook-app_id": app_id,
      "x-team4hook-subscription_id": subscription._id,
      "x-team4hook-event_type": "ping",
    },
    timeout: 5000,
    maxRedirects: 0,
  };

  try {
    const body = { msg: "Congrats on creating a new endpoint!" };
    await axios.post(subscription.url, body, config);
  } catch (error) {
    console.log("Could not ping new endpoint.  Endpoint still created.");
  }
};

const getSubscriptions = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Subscription.find({ app_id: req.params.app_id })
    .populate("event_types")
    .then((subs) => {
      res.json(subs);
    })
    .catch((error) => console.log(error));
};

const getSubscriptionsByTopic = (req, res, next) => {
  Subscription.find({
    app_id: req.params.app_id,
    event_types: { $in: req.event.event_type },
  }).then((subscriptions) => {
    req.subscribers = subscriptions.map((sub) => ({
      id: sub._id,
      url: sub.url,
      secret: sub.signingSecret,
    }));

    next();
  });
};

const deleteSubscription = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log("deleting subscription: ", req.params.sub_id);
  Subscription.findByIdAndDelete(req.params.sub_id)
    .then(() => res.status(204).send())
    .catch((error) => console.log(error));
};

exports.getSubscriptions = getSubscriptions;
exports.getSubscriptionsByTopic = getSubscriptionsByTopic;
exports.createSubscription = createSubscription;
exports.deleteSubscription = deleteSubscription;
