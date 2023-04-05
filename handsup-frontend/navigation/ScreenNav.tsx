import React, { createContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState, User } from "../redux/types/types";
import store from "../redux/store/store";
import { setIsLoading } from "../redux/slices/loadingSlice";
import { setUser } from "../redux/slices/userSlice";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Screens
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import JoinTeam from "../screens/JoinTeam";
import CreateTeam from "../screens/CreateTeam";
import Home from "../screens/Home";
import CreatePoll from "../screens/CreatePoll";
import UserProfile from "../screens/UserProfile";
import Groups from "../screens/Groups";
import Loading from "../screens/Loading";
import GroupInfo from "../screens/GroupInfo";
import PollCard from "../components/PollCard";
import { setIsLoggedIn } from "../redux/slices/loggedInSlice";

const Stack = createStackNavigator();

export default function ScreenNav() {
  const dispatch = useDispatch();
  const isLoading: boolean = useSelector((state: RootState) => state.isLoading);
  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state.isLoggedIn
  );
  const user: User = useSelector((state: RootState) => state.user);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        dispatch(setIsLoading(true));
        const token = await AsyncStorage.getItem("handsup-token");
        token ? setToken(token) : setToken(null);
        if (token) {
          dispatch(setIsLoggedIn(true));
          const decodedUser = jwtDecode(token);
          console.log({ decodedUser } + "decoded user");
          dispatch(setUser(decodedUser as User));
        } else {
          dispatch(setIsLoggedIn(false));
        }
      } catch (err) {
        console.log("Error getting token from AsyncStorage:", err.message);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    checkToken();
  }, [dispatch, user, isLoggedIn]);

  useEffect(() => {
    dispatch(setIsLoggedIn(Boolean(token)));
    console.log(Boolean(token) + "isLoggedIn");
  }, [token]);

  return isLoading ? (
    <Loading />
  ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CreatePoll"
          component={CreatePoll}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PollCard"
          component={PollCard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinTeam"
          component={JoinTeam}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTeam"
          component={CreateTeam}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupInfo"
          component={GroupInfo}
          options={{
            headerShown: false,
            animationTypeForReplace: "push",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
