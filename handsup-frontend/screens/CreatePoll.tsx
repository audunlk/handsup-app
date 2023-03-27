import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { UserContext } from '../navigation/ScreenNav';
import { createPoll } from '../services/pollSetup';
import DateSelector from '../components/DateSelector';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Subscription } from 'expo-notifications';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function CreatePoll({ navigation, route }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const { user } = useContext(UserContext);
  const [group, setGroup] = useState(route.params.group);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState([]);
  


  const [poll, setPoll] = useState({
    description: '',
    created_at: new Date(),
    respond_by: new Date(new Date().toUTCString()),
    question: '',
    group_id: group.id,
    answer_choices: answers,
  });
  
  useEffect(() => {
    console.log({group})
    console.log('group in create poll');
    console.log({poll})
    console.log(poll.respond_by)
  }, [group])

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);



  



  const handleCreatePoll = async () => {
    setIsLoading(true);
    try{
      const pollData = {
        question: poll.question,
        description: poll.description,
        created_at: poll.created_at,
        respond_by: poll.respond_by.toISOString(),
        group_id: poll.group_id,
        answer_choices: answers,
      };
      const { question, description, created_at, respond_by,  group_id, answer_choices } = pollData;
      const pollResponse = await createPoll( question, description, created_at, respond_by,  group_id, answer_choices);
      navigation.navigate('Home');

    } catch (error) {
      setError(error.message);
    }finally{
      setIsLoading(false);
    }
    
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, '']);
    console.log(answers)
  };

  const handleAnswerTextChange = (index, text) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
    console.log(answers)
  };

  



  return (
    <View style={styles.container}>
      <Text>Create Poll</Text>
      
      <View style={styles.question}>
      <TextInput
          placeholder="Question"
          onChangeText={(text) => setPoll({ ...poll, question: text })}
          value={poll.question}
        />
        <DateSelector 
          UTCdate={poll.respond_by} setPoll={setPoll} poll={poll}
        />
        <View>
          {answers.map((answer, index) => (
            <TextInput
              key={index}
              placeholder={`Answer ${index + 1}`}
              onChangeText={(text) => handleAnswerTextChange(index, text)}
              value={answer.text}
            />
          ))}

          <Button title="Add more answers" onPress={handleAddAnswer} />
        </View>
      </View>
      <Button title="Create Poll" onPress={handleCreatePoll} />
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 5 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    question: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    answer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});