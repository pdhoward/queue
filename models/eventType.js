const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const App = require("./app");

const EventTypeSchema = new Schema({
  app_id: { type: Schema.Types.ObjectId, ref: App },
  description: { type: String, required: true },
  created_at: { type: Date, default: new Date() },
});

EventTypeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;   
  },
});

const EventType = mongoose.model("EventType", EventTypeSchema);

module.exports = EventType;
