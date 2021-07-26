const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventType = require("./eventType");
const App = require("./app");

const SubscriptionSchema = new Schema({
  app_id: { type: Schema.Types.ObjectId, ref: App },
  url: { type: String, required: true },
  event_types: [{ type: Schema.Types.ObjectId, ref: EventType }],
  active: { type: Boolean, default: true },
  signingSecret: String,
  token: String,
  authenticationSecret: String,
  confirmation: Date,
});

SubscriptionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.signingSecret;
  },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
