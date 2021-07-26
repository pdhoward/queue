const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventType = require("./eventType");
const App = require("./app");

const EventSchema = new Schema({
  app_id: { type: Schema.Types.ObjectId, ref: App },
  affected_resource: String,
  payload: Schema.Types.Mixed,
  receivedAt: { type: Date, default: new Date() },
  event_type: { type: Schema.Types.ObjectId, ref: EventType },
});

EventSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
