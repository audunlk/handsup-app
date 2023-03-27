import React, { createContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../services/accountSetup';
import jwtDecode from 'jwt-decode';

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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  interface CurrentUser {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    username: string,
  }

  useEffect(() => {
    const decodeToken = async () =>{
      try {
      const token = await AsyncStorage.getItem('handsup-token').then((res) => res
      );
      if (token) {
        const decodedToken: CurrentUser = await jwtDecode(token);
        const user = await getUser(decodedToken.id);
        setUser(user);
      } else{
        console.log('No token found')
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }
  decodeToken();
}, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoading ? (
            <Stack.Screen name='Loading' component={Loading} />
          ) : user ? (
            <>
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
            </>
          ) : (
            <>
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
              
            </>
          )}
        </Stack.Navigator>

      </NavigationContainer>
    </UserContext.Provider>
  );
}
