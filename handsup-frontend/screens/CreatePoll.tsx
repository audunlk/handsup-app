import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { UserContext } from '../navigation/ScreenNav';
import { createPoll } from '../services/pollSetup';
import DateSelector from '../components/DateSelector';

export default function CreatePoll({ navigation, route }) {
  const { user } = useContext(UserContext);
  const [group, setGroup] = useState(route.params.group);
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


  const handleCreatePoll = async () => {
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
    const pollId = pollResponse.id;

    navigation.navigate('Home');
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
    </View>
  );
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