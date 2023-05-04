import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser } from './firebaseRequests';
import { User } from '../redux/types/types';

export const getPermission = async (user: User) => {
    if(Device.isDevice){
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        await AsyncStorage.setItem('pushToken', '');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync(
        { projectId: Constants.manifest.extra.expoProjectId }
      )).data;
      console.log(token);
      //store token in firebase users collection to send notifications to groups
      await updateUser(user.id, { ...user, expoPushToken: token})
      console.log('token stored in firebase')
      await AsyncStorage.setItem('pushToken', token);
    }

    if(Platform.OS === 'android'){
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

