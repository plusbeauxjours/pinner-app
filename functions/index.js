const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp(functions.config().firebase);
console.log("initial event");

exports.sendNotification = functions.database
  .ref("messages/{roomId}/{messageId}")
  .onCreate(event => {
    console.log("event.data: ", event);
    console.log("event.data: ", event._data);
    console.log(
      "event.data.receiverPushToken: ",
      event._data.receiverPushToken
    );
    console.log("event.data.text: ", event._data.text);
    const sendMessageUserId = event._data.user._id;
    const sendUserName = event._data.user.name;
    const sendMsg = event._data.text;
    const receiverPushToken = event._data.receiverPushToken;
    const messages = [];
    console.log("receiverPushToken", receiverPushToken);
    console.log("receiverPushToken", JSON.stringify(receiverPushToken));
    console.log("sendMsg", sendMsg);
    console.log("sendMsg", JSON.stringify(sendMsg));
    return axios.post("https://exp.host/--/api/v2/push/send", {
      to: receiverPushToken,
      title: "New message",
      body: `${sendUserName}: ${sendMsg}`
    });
  });