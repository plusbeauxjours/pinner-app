const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database
  .ref("messages/{roomId}/{messageId}")
  .onCreate(event => {
    let sendMsg
    const sendMessageUserId = event._data.user._id;
    const sendUserName = event._data.user.name;
    const receiverPushToken = event._data.receiverPushToken;
    const messages = [];
    if (event._data.text) {
      sendMsg = event._data.text
    } else if (event._data.location) {
      sendMsg = "LOCATION"
    } else if (event._data.snsIdPlatform === "PHONE_SECOND") {
      sendMsg = "PHONE"
    } else if (event._data.snsIdPlatform === "EMAIL_SECOND") {
      sendMsg = "EMAIL"
    } else {
      sendMsg = event._data.snsIdPlatform
    }
    console.log("receiverPushToken", receiverPushToken)
    if (receiverPushToken) {
      return axios.post("https://exp.host/--/api/v2/push/send", {
        to: receiverPushToken,
        title: "New message",
        body: `${sendUserName}: ${sendMsg}`
      });
    }
  });