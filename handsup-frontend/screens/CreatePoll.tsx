import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { createPoll } from "../services/pollSetup";
import DateSelector from "../components/DateSelector";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Subscription } from "expo-notifications";
import { User, RootState } from "../redux/types/types";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import Header from "../components/Header";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function CreatePoll({ navigation, route }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const user: User = useSelector((state: RootState) => state.user);

  const [group, setGroup] = useState(route.params.group);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [poll, setPoll] = useState({
    description: "",
    created_at: new Date(),
    respond_by: new Date(new Date().toUTCString()),
    question: "",
    group_id: group.id,
    answer_choices: answers,
  });


  const handleCreatePoll = async () => {
    setIsLoading(true);
    try {
      const pollData = {
        question: poll.question,
        description: poll.description,
        created_at: poll.created_at,
        respond_by: poll.respond_by.toISOString(),
        group_id: poll.group_id,
        answer_choices: answers,
      };
      const pollResponse = await createPoll({ ...pollData })
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
    console.log(answers);
  };

  const handleAnswerTextChange = (index, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
    console.log(answers);
  };

  return (
    <View style={styles.container}>
      <Text>Create Poll</Text>
      <Header navigation={navigation} title={group.name} showExit={true} />
    <View style={[styles.body]}>
      <View>
        <TextInput
          placeholder="Question"
          style={styles.input}
          autoFocus={true}
          onChangeText={(text) => setPoll({ ...poll, question: text })}
          value={poll.question}
        />
        <DateSelector setPoll={setPoll} poll={poll} />
        <View>
          {answers.map((answer, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Answer ${index + 1}`}
              onChangeText={(text) => handleAnswerTextChange(index, text)}
              value={answer}
            />
          ))}
          <Button title="Add more answers" onPress={handleAddAnswer} />
        </View>
      </View>
      <Button title="Create Poll" onPress={handleCreatePoll} />
      {/* <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>
            Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View> */}
      </View>
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { screen: "AnswerPoll" },
    },
    trigger: { seconds: 5 },
  });
}

async function registerForPushNotificationsAsync() {
  let token: string;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}


