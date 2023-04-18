import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState, User } from "../redux/types/types";
import { setIsLoading } from "../redux/slices/loadingSlice";
import { setUser } from "../redux/slices/userSlice";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIsLoggedIn } from "../redux/slices/loggedInSlice";
import LoginOrRegister from "../screens/LoginOrRegister";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

//Screens
import JoinTeam from "../screens/JoinTeam";
import CreateTeam from "../screens/CreateTeam";
import Home from "../screens/Home";
import CreatePoll from "../screens/CreatePoll";
import UserProfile from "../screens/UserProfile";
import Groups from "../screens/Groups";
import Loading from "../screens/Loading";
import GroupInfo from "../screens/GroupInfo";
import PollCard from "../components/PollCard";
import CreateProfile from "../screens/CreateProfile";

const Stack = createStackNavigator();

export default function ScreenNav() {
  const dispatch = useDispatch();
  const isLoading: boolean = useSelector((state: RootState) => state.isLoading);
  const isLoggedIn: boolean = useSelector((state: RootState) => state.isLoggedIn);
  const user: User = useSelector((state: RootState) => state.user);
  const [token, setToken] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);


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


  function LoggedInStack() {
    return (
      <Stack.Navigator initialRouteName={
        isFirstTime ? "CreateProfile" : "Home"
      }>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="CreatePoll"
          component={CreatePoll}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="PollCard"
          component={PollCard}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="JoinTeam"
          component={JoinTeam}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="CreateTeam"
          component={CreateTeam}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="GroupInfo"
          component={GroupInfo}
          options={{
            headerShown: false,
            animationTypeForReplace: "pop",
            presentation: "card",

          }}
        />
      </Stack.Navigator>
    );
  }
  
  function LoggedOutStack() {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginOrRegister}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isLoading ? (
        <Loading />
      ) : isLoggedIn ? (
        <LoggedInStack />
      ) : (
        <LoggedOutStack />
      )}
    </NavigationContainer>
  );
}







