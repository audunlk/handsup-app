import React, { createContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import store from '../redux/store/store';


//Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import JoinTeam from '../screens/JoinTeam';
import CreateTeam from '../screens/CreateTeam';
import Home from '../screens/Home';
import CreatePoll from '../screens/CreatePoll';
import UserProfile from '../screens/UserProfile';
import Groups from '../screens/Groups';
import Loading from '../screens/Loading';
import GroupInfo from '../screens/GroupInfo';
import PollCard from '../components/PollCard';



const Stack = createStackNavigator();
export const UserContext = createContext(null);



export default function ScreenNav() {
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  return (
    <Provider store={store}>
      <NavigationContainer 
      >
        <Stack.Navigator
        initialRouteName='Login'
        >
            <Stack.Screen
                name='Home'
                component={Home}
                options={{ headerShown: false }}
              />
            <Stack.Screen name='CreatePoll' component={CreatePoll} 
            options={{ headerShown: false }}
            />
            <Stack.Screen name='PollCard' component={PollCard}
            options={{ headerShown: false }}
             />
              <Stack.Screen
                name='UserProfile'
                component={UserProfile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Groups'
                component={Groups}
                options={{ headerShown: false,
                 }}
              />
              <Stack.Screen
              name='GroupInfo'
              component={GroupInfo}
              options={{ headerShown: false,
                 animationTypeForReplace: 'push',
                 presentation: 'modal'
               }}
            />
              <Stack.Screen
                name='JoinTeam'
                component={JoinTeam}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='CreateTeam'
                component={CreateTeam}
                options={{ headerShown: false }}
              />
            
              <Stack.Screen
                name='Login'
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Signup'
                component={Signup}
                options={{ headerShown: false }}
              />
              
        
        </Stack.Navigator>

      </NavigationContainer>
    </Provider>
  );
}
