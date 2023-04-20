import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Touchable } from "react-native";
import DateSelector from "../components/DateSelector";
import { User, RootState, Poll } from "../redux/types/types";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import Header from "../components/Header";
import { createPoll, createPollChat } from "../services/firebaseRequests";
import 'react-native-get-random-values';

import { v4 as uuidv4 } from "uuid";

export default function CreatePoll({ navigation, route }) {
  const user: User = useSelector((state: RootState) => state.user);
  const [team, setTeam] = useState(route.params.team);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [poll, setPoll] = useState({
    id: uuidv4(),
    description: "",
    created_at: new Date(),
    respond_by: new Date(new Date().toUTCString()),
    question: "",
    teamSerial: team.serialKey,
    answer_choices: answers,
  });

  useEffect(() => {
    console.log(team);
  }, [team]);
  const hasEmptyAnswers =  answers.some(answer => answer.trim() === "");
  const canCreatePoll = poll.question.trim() !== "" && !hasEmptyAnswers;

  const handleCreatePoll = async () => {
    console.log("creating poll")
    const isMultipleChoice = answers.length > 2;
    try {
      const pollData = {
        id: poll.id,
        question: poll.question,
        created_at: poll.created_at.toISOString(),
        respond_by: poll.respond_by.toISOString(),
        teamSerial: poll.teamSerial,
        teamName: team.name,
        answer_choices: answers,
        membersAnswered: [],
      };
      console.log(pollData)
      const pollResponse = await createPoll(pollData)
      await createPollChat(poll.id, user.id);
      console.log(pollResponse);
      if(pollResponse) {
      navigation.navigate("Home");
      } else {
        setError("Error creating poll");
      }
    } catch (error) {
      setError(error.message);
    } 
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
    console.log(answers);
  };

  const handleAnswerTextChange = (index, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
    console.log(answers);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <TextInput
          placeholder="Question"
          style={styles.input}
          autoFocus={true}
          onChangeText={(text) => setPoll({ ...poll, question: text })}
          value={poll.question}
        />
        <View>
          <DateSelector setPoll={setPoll} poll={poll} />
        </View>
        {answers.map((answer, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Answer ${index + 1}`}
            onChangeText={(text) => handleAnswerTextChange(index, text)}
            value={answer}
          />
        ))}
        {hasEmptyAnswers && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            Please provide an answer for each choice
          </Text>
        )}
        <TouchableOpacity style={styles.btn} onPress={handleAddAnswer}>
          <Text style={styles.mediumText}>Add Answer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={
            () => handleCreatePoll()
          }
          disabled={!canCreatePoll}
        >
          <Text style={styles.mediumText}>Create Poll</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
