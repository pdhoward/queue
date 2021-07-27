const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
});

AppSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const App = mongoose.model("App", AppSchema);

module.exports = App;
