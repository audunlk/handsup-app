import React, {useEffect, useState, useRef} from 'react';
import ScreenNav from './navigation/ScreenNav';
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


export default function App() {
  


  return (
    <Provider store={store}>
      <ScreenNav />
    </Provider>
  );
}


