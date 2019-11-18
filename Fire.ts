import firebase from "firebase";
import keys from "./keys";
import { SystemMessage } from "react-native-gifted-chat";
import path from "react-native-path";

const firebaseConfig = {
  apiKey: keys.REACT_APP_FIREBASE_API_KEY,
  authDomain: keys.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: keys.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: keys.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: keys.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: keys.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: keys.REACT_APP_FIREBASE_APP_ID,
  measurementId: keys.REACT_APP_FIREBASE_MEASUREMENT_ID
};
export const fb_app = firebase.initializeApp(firebaseConfig);
export const fb_db = firebase.database().ref();

export const database = firebase.database();

export interface UserChatMessage {
  _id: string;
  name: string;
  avatar?: string;
}

export interface ChatMessage {
  _id: string;
  text?: string;
  createdAt: Date;
  user: UserChatMessage;
  image?: string;
}

export interface GalleryImage {
  image: string;
  created: string;
  author: string;
  label: string;
}

export const image_upload = async (
  image_path: string,
  folder: string,
  name: string
) => {
  const blob = await urlToBlob(image_path);
  const ref: any = firebase
    .storage()
    .ref(folder)
    .child(name);
  const result = await ref.put(blob);
  return result.ref;
};

export const image_upload_chat = async (
  chat_id: string,
  image_path: string,
  resolution: "full" | "high" | "low"
) => {
  const result = await image_upload(
    image_path,
    `chat_pictures/${chat_id}/${Date()}`,
    resolution
  );
  return result.getDownloadURL();
};

function urlToBlob(url: string) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}

export const chat_leave = (
  chat_id: string,
  user_id: string,
  user_name: string
) => {
  let new_key = fb_db.ref.child("messages").push().key;
  let message = {
    _id: new_key,
    text: `User ${user_name} left`,
    createdAt: new Date(),
    system: true
  };
  let updates = {};
  updates[`/members/${chat_id}/${user_id}/member`] = false;
  updates[`/chats/${chat_id}/lastMessage/`] = message.text;
  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates);
};

export const get_new_key = (child: string) => {
  if (!child) {
    child = "messages";
  }
  let new_key = fb_db.ref.child(child).push().key;
  return new_key;
};

export const chat_send = (chat_id: string, message: ChatMessage) => {
  let new_key;
  if (!message._id) {
    new_key = fb_db.ref.child("messages").push().key;
    message._id = new_key;
  } else {
    new_key = message._id;
  }
  let updates = {};
  if (message.text) {
    updates[
      `/chats/${chat_id}/lastMessage/`
    ] = `${message.user.name}: ${message.text}`;
  } else {
    updates[
      `/chats/${chat_id}/lastMessage/`
    ] = `${message.user.name}: ${message.image}`;
  }

  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates);
};

export const get_old_chat_messages = async (
  chatId: string,
  resolution: string,
  userId: string
) => {
  return new Promise<any[]>((resolve, reject) => {
    fb_db.ref
      .child("messages")
      .child(chatId)
      .orderByKey()
      .once("value", snapshot => {
        let messages = [];
        /* tslint:disable:no-string-literal */
        if (!snapshot) {
          resolve(undefined);
        }
        let promises = [];
        snapshot.forEach(child => {
          if (child && child.val() && child.val()["_id"]) {
            let message: ChatMessage;
            let systemMessage: SystemMessage;

            if (child.val().system) {
              systemMessage = child.val();
              messages.push(systemMessage);
            } else {
              message = child.val();
              if (!message.image) {
                messages.push(message);
              } else {
                let promise = image_get_raw(message.image, resolution).then(
                  image => {
                    message.image = image;
                    messages.push(message);
                  }
                );
                promises.push(promise);
              }
            }
          }
          /* tslint:enable:no-string-literal */
        });
        Promise.all(promises).then(() => {
          resolve(messages);
        });
      });
  });
};

export const image_get_raw = async (image_path: string, resolution: string) => {
  console.log("image get raw got a request");
  if (image_path.startsWith("chat_pictures")) {
    if (resolution === "full") {
      return firebase
        .storage()
        .ref(image_path)
        .getDownloadURL();
    } else if (resolution === "high") {
      if (path.basename(image_path) === "full") {
        return firebase
          .storage()
          .ref(image_path)
          .parent.child("HIGH")
          .getDownloadURL();
      } else {
        return firebase
          .storage()
          .ref(image_path)
          .getDownloadURL();
      }
    } else {
      // resolution === "low"
      if (path.basename(image_path) === "low") {
        return firebase
          .storage()
          .ref(image_path)
          .getDownloadURL();
      } else {
        return firebase
          .storage()
          .ref(image_path)
          .parent.child("LOW")
          .getDownloadURL();
      }
    }
    // return firebase.storage().ref(image_path).parent.child("high").getDownloadURL();
  }
  return image_path;
};

export const update_message_info = async (msg: any, chat_id: string) => {
  return new Promise<ChatMessage | SystemMessage>((resolve, reject) => {
    if (msg.system) {
      resolve(msg);
    }

    fb_db.ref
      .child("messages")
      .child(chat_id)
      .orderByKey()
      .once("value", snapshot => {
        if (!snapshot.exists()) {
          console.log("User doesn't belong to the chat");
          resolve(undefined);
        }
      });
  });
};
