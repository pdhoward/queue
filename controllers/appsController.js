const App = require("../models/app");
const { validationResult } = require("express-validator");

const getApps = (req, res, next) => {
  App.find()
    .then((apps) => res.json(apps))
    .catch((error) => console.log(error));
};

const createApp = (req, res, next) => {
  App.create(req.body)
    .then((app) => res.json(app))
    .catch((error) => console.log(error));
};

const updateApp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newName = req.body.name;
  const updates = { name: newName };

  App.findByIdAndUpdate(req.params.app_id, updates, { new: true })
    .then((app) => res.json(app))
    .catch((error) => console.log(error));
};

exports.getApps = getApps;
exports.createApp = createApp;
exports.updateApp = updateApp;
