const express = require("express");
const router = express.Router();
const appsController = require("../controllers/appsController");
const subsController = require("../controllers/subsController");
const eventTypesController = require("../controllers/eventTypesController");
const messagesController = require("../controllers/messagesController");
const eventsController = require("../controllers/eventsController");
const {
  validateApp,
  validateSubscription,
} = require("../validators/validators");

router.get("/apps", appsController.getApps);
// router.get("/apps/:app_id", appsController.getApp);
router.post("/apps", appsController.createApp);
router.patch("/apps/:app_id", validateApp, appsController.updateApp);
// router.delete("/apps/:id", appsController.deleteApp);

router.get(
  "/apps/:app_id/event_types",
  validateApp,
  eventTypesController.getEventTypes
);
// router.get("/apps/:app_id/event_types/:event_id", validateApp, eventTypesController.getEventType);
router.post(
  "/apps/:app_id/event_types",
  validateApp,
  eventTypesController.createEventType
);
// router.patch("/apps/:app_id/event_types/:event_id", validateApp, eventTypesController.createEventType);
// router.delete("/apps/:app_id/event_types/:event_id", validateApp, eventTypesController.createEventType);

router.get("/apps/:app_id/subs", validateApp, subsController.getSubscriptions);
// router.get("/apps/:app_id/subs/:sub_id", validateApp, subsController.getSubscription);
router.post(
  "/apps/:app_id/subs",
  validateApp,
  subsController.createSubscription
);
// router.patch("/apps/:app_id/subs/:sub_id", validateApp, subsController.updateSubscription);
router.delete(
  "/apps/:app_id/subs/:sub_id",
  validateApp,
  validateSubscription,
  subsController.deleteSubscription
);

router.get("/apps/:app_id/msgs", validateApp, messagesController.getMessages);
router.post(
  "/apps/:app_id/msgs",
  validateApp,
  eventsController.createEvent,
  subsController.getSubscriptionsByTopic,
  messagesController.createMessages
);

module.exports = router;
