import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenNav from './navigation/ScreenNav';
import messaging from '@react-native-firebase/messaging';




export default function App() {

  
  return (
      <ScreenNav />
  );
}


