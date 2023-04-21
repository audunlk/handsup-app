import React, {useEffect} from 'react';
import ScreenNav from './navigation/ScreenNav';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import store from './redux/store/store';




export default function App() {

  
  return (
    <Provider store={store}>
      <ScreenNav />
    </Provider>
  );
}


