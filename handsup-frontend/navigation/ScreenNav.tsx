import React, { useEffect, useState, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import { setUser } from "../redux/slices/userSlice";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import jwtDecode from "jwt-decode";
import { setIsLoggedIn } from "../redux/slices/loggedInSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getPermission } from '../services/getPushPermission';
import { schedulePushNotification } from '../services/pushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, RootState } from '../redux/types/types';

//Screens
import Loading from "../screens/Loading";
import { LoggedInStack, LoggedOutStack } from "./ScreenStacks";

const Stack = createStackNavigator();

export default function ScreenNav() {
  const dispatch = useDispatch();
  const isLoading: boolean = useSelector((state: RootState) => state.isLoading);
  const isLoggedIn: boolean = useSelector((state: RootState) => state.isLoggedIn);
  const user: User = useSelector((state: RootState) => state.user);
  const [token, setToken] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const [notifications, setNotifications] = useState(false);
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    if(user.firstName){
      const getPushPermission = async () => {
        try {
            await getPermission(user);
        } catch (err) {
          console.log("Error getting push permission:", err.message);
        }
      };
      getPushPermission();
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotifications(!notification);
      });
      
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      }
      );
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    }
  }, [user.firstName]);

  
  

  useEffect(() => {
    dispatch(setIsLoading(true));
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("handsup-token");
        token ? setToken(token) : setToken(null);
        if (token) {
          console.log(isLoggedIn)
          const decodedUser: any = jwtDecode(token);
          const userDoc = doc(db, 'users', decodedUser.user_id);
          const userDocSnap = await getDoc(userDoc);
          const userDocData = userDocSnap.data();
          console.log({ userDocData })
          !userDocData.firstName ? setIsFirstTime(true) : setIsFirstTime(false);
          dispatch(setUser(userDocData as User));
          console.log({ decodedUser })
        } else {
          dispatch(setIsLoggedIn(false));
        }
      } catch (err) {
        console.log("Error getting token from AsyncStorage:", err.message);
      }finally{
        dispatch(setIsLoading(false));
      }
    };
    checkToken();
  }, [dispatch, user, isLoggedIn, isFirstTime]);

  useEffect(() => {
    dispatch(setIsLoggedIn(Boolean(token)));
    console.log(Boolean(token) + "  isLoggedIn");
  }, [token, dispatch]);


  const loggedInStack = LoggedInStack(isFirstTime)
  const loggedOutStack = LoggedOutStack()
  

  return (
    <NavigationContainer>
      {isLoading ? (
        <Loading />
      ) : isLoggedIn ? (
        loggedInStack
      ) : (
        loggedOutStack
      )}
    </NavigationContainer>
  );
}

