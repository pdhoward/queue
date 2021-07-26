import axios from "axios";

const unwrapData = (response) => response.data;

const getSubscriptions = (app_id, callback) => {
  axios
    .get(`/api/v1/apps/${app_id}/subs`)
    .then(unwrapData)
    .then((subs) => callback(subs))
    .catch((error) => console.log(error));
};

const addSubscription = (app_id, newSubscription, callback) => {
  axios
    .post(`/api/v1/apps/${app_id}/subs`, newSubscription)
    .then(unwrapData)
    .then((sub) => callback(sub))
    .catch((error) => console.log(error));
};

const deleteSubscription = (app_id, subscription_id, callback) => {
  axios
    .delete(`/api/v1/apps/${app_id}/subs/${subscription_id}`)
    .then(() => callback(subscription_id))
    .catch((error) => console.log(error));
};

const getEventTypes = (app_id, callback) => {
  axios
    .get(`/api/v1/apps/${app_id}/event_types`)
    .then(unwrapData)
    .then((eventTypes) => callback(eventTypes))
    .catch((error) => console.log(error));
};

const notifySubscribers = (app_id, newEvent) => {
  axios
    .post(`/api/v1/apps/${app_id}/msgs`, newEvent)
    .then(unwrapData)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
};

export default {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
  notifySubscribers,
  getEventTypes,
};
