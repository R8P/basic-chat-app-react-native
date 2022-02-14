import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import { View } from "react-native";
import firebase from "firebase/compat/app";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);

  const [uid, setUID] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setUID(user?.uid);
      setName(user?.displayName);
    });
  }, []);

  useEffect(() => {
    return firebase
      .firestore()
      .doc("chats/" + route.params.chatId)
      .onSnapshot((snapshot) => {
        setMessages(snapshot.data()?.messages ?? []);
      });
  }, []);

  const onSend = (m = []) => {
    firebase
      .firestore()
      .doc("chats/" + route.params.chatId)
      .set(
        {
          messages: GiftedChat.append(messages, m),
        },
        { merge: true }
      );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
    </View>
  );
};

export default Chat;
