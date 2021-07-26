const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/api");
require("dotenv").config();
const queue = require("./controllers/queueController");
const app = express();
const port = process.env.PORT || 3001;

mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(
    `url = ${req.url}`, 
    `path = ${req.path}`, 
    `body = ${JSON.stringify(req.body)}`, 
    `method = ${req.method}`)
  next()
 });

app.use("/api/v1", routes);



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  queue.initializePriorityQueue();
});
