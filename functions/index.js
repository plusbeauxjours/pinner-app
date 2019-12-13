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

// console.log('event.data.val() : ', event.data.val());
// const dataVal = event.data.val();
// if (!dataVal) {
//     return console.log('Message data null! ');
// }

// const roomId = event.params.roomId; //이벤트가 발생한 방ID
// const sendMessageUserId = dataVal.uid; //메세지 발송자 ID
// const sendUserName = dataVal.userName; //메세지 발송자 이름
// const sendMsg = dataVal.message; //메세지
// const sendProfile = dataVal.profileImg ? dataVal.profileImg : ''; // 프로필 이미지
// const promiseUsersConnection = admin.database().ref('UsersConnection').orderByChild('connection').equalTo(true).once('value'); // 접속자 데이터

// return Promise.all([promiseRoomUserList, promiseUsersConnection]).then(results => {
//     const roomUsersSnapShot = results[0];
//     const usersConnectionSnapShot = results[1];
//     const arrRoomUserList = [];
//     const arrConnectionUserList = [];

//     if (roomUsersSnapShot.hasChildren()) {
//         roomUsersSnapShot.forEach(snapshot => {
//             arrRoomUserList.push(snapshot.key);
//         })
//     } else {
//         return console.log('RoomUserlist is null')
//     }

//     if (usersConnectionSnapShot.hasChildren()) {
//         usersConnectionSnapShot.forEach(snapshot => {
//             const value = snapshot.val();
//             if (value) {
//                 arrConnectionUserList.push(snapshot.key);
//             }
//         })
//     } else {
//         return console.log('UserConnections Data가 없습니다');
//     }

//     const arrTargetUserList = arrRoomUserList.filter(item => {
//         return arrConnectionUserList.indexOf(item) === -1;
//     });

//     console.log('arrTargetUserList : ', arrTargetUserList);
//     const arrTargetUserListLength = arrTargetUserList.length;
//     for (let i = 0; i < arrTargetUserListLength; i++) {
//         console.log(`FcmId/${arrTargetUserList[i]}`);
//         arrTargetUserListFn(i)
//     }
//     return null
// });
// });

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
