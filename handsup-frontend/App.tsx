import React, {useEffect, useState, useRef} from 'react';
import ScreenNav from './navigation/ScreenNav';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import * as Notifications from 'expo-notifications';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if(Platform.OS === 'android'){
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export default function App() {
  
  return (
    <Provider store={store}>
      <ScreenNav />
    </Provider>
  );
}


