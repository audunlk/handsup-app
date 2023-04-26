import JoinTeam from "../screens/JoinTeam";
import CreateTeam from "../screens/CreateTeam";
import Home from "../screens/Home";
import CreatePoll from "../screens/CreatePoll";
import UserProfile from "../screens/UserProfile";
import Groups from "../screens/Groups";
import GroupInfo from "../screens/GroupInfo";
import LoginOrRegister from "../screens/LoginOrRegister";
import PollCard from "../components/PollCard";
import CreateProfile from "../screens/CreateProfile";
import Chat from "../components/Chat";
import { createStackNavigator } from "@react-navigation/stack";
import { Modal } from "react-native";

const Stack = createStackNavigator();

export const LoggedInStack = (isFirstTime: boolean) => {
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
            options={{ headerShown: false, 
              animationEnabled: false,
             }}
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
          <Stack.Screen
          name='Chat'
          component={Chat}
          options={{
            headerShown: false,
            animationTypeForReplace: "pop",
            presentation: "card",
          }}
          />
        </Stack.Navigator>
      );
    }

export const LoggedOutStack = () => {
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
