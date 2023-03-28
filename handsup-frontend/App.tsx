import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect } from "react";
import ScreenNav from "./navigation/ScreenNav";
import messaging from "@react-native-firebase/messaging";

export default function App() {
  // const requestUserPermission = async () => {
  //   async function requestUserPermission() {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (requestUserPermission) {
  //     messaging()
  //       .getToken()
  //       .then((token) => {
  //         console.log(token);
  //       });
  //   }else{
  //     console.log('no permission')
  //   }

  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Message handled in the background!', remoteMessage);
  //   });

  //   messaging()
  //   .getInitialNotification()
  //   .then(async (remoteMessage) => {
  //     if (remoteMessage) {
  //       console.log(
  //         'Notification caused app to open from quit state:',
  //         remoteMessage.notification,
  //       );
  //     }
  //   });

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //    // navigation.navigate(remoteMessage.data.type);
  //   });

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  return <ScreenNav />;
}
