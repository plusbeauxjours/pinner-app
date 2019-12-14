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
      to: "ExponentPushToken[8cyY19OfrGL6E9_jCzTdCM]",
      title: "New message",
      body: JSON.stringify(sendMsg)
    });
  });

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// expo.sendPushNotificationsAsync([{
//     to: token,
//     sound: 'default',
//     body: `${author.name}: ${updateInfo.lastMessage}`,
//     data: {
//       chatId: event.data.key,
//       chatInfo: updateInfo
//     },
//     title: 'WoodyBoater',
//   }]).then(receipts => {
//     console.log('Successfully sent push');
//     console.log(receipts);
//   }).catch(error => {
//     console.log('Error sending push notification');
//     console.log(error);
//   });
