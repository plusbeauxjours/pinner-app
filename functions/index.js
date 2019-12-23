const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database
  .ref("messages/{roomId}/{messageId}")
  .onCreate(event => {
    const sendMessageUserId = event._data.user._id;
    const sendUserName = event._data.user.name;
    const sendMsg = event._data.text;
    const receiverPushToken = event._data.receiverPushToken;
    const messages = [];
    return axios.post("https://exp.host/--/api/v2/push/send", {
      to: receiverPushToken,
      title: "New message",
      body: `${sendUserName}: ${sendMsg}`
    });
  });