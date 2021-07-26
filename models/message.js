const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventType = require("./eventType");
const Subscription = require("./subscription");
const Event = require("./event");
const App = require("./app");

const MessageSchema = new Schema({
  app_id: { type: Schema.Types.ObjectId, ref: App },
  subscription_id: { type: Schema.Types.ObjectId, ref: Subscription },
  event_id: { type: Schema.Types.ObjectId, ref: Event },
  event_type: { type: Schema.Types.ObjectId, ref: EventType },
  payload: Schema.Types.Mixed,
  sentAt: Date,
  deliveredAt: Date,
  deliveryAttempt: { type: Number, default: 1 },
  deliveryState: { type: Boolean, default: false },
  requestData: Schema.Types.Mixed,
  responseData: Schema.Types.Mixed,
});

MessageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
