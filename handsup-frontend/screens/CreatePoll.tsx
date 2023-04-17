import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Touchable } from "react-native";
import DateSelector from "../components/DateSelector";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Subscription } from "expo-notifications";
import { User, RootState } from "../redux/types/types";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import Header from "../components/Header";

export default function CreatePoll({ navigation, route }) {
  const user: User = useSelector((state: RootState) => state.user);
  const [group, setGroup] = useState(route.params.group);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [poll, setPoll] = useState({
    description: "",
    created_at: new Date(),
    respond_by: new Date(new Date().toUTCString()),
    question: "",
    group_id: group.id,
    answer_choices: answers,
  });
  const hasEmptyAnswers =  answers.some(answer => answer.trim() === "");
  const canCreatePoll = poll.question.trim() !== "" && !hasEmptyAnswers;

  const handleCreatePoll = async () => {
    setIsLoading(true);
    try {
      const pollData = {
        question: poll.question,
        description: poll.description,
        created_at: poll.created_at,
        respond_by: poll.respond_by.toISOString(),
        group_id: poll.group_id,
        answer_choices: answers,
      };
      const pollResponse = await createPoll(pollData)
      console.log()
      if(pollResponse) {
      navigation.navigate("Home");
      } else {
        setError("Error creating poll");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
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
      <Header navigation={navigation} title={group.name} showExit={true} />
      <ScrollView contentContainerStyle={styles.scrollBody}>
        <TextInput
          placeholder="Question"
          style={styles.input}
          autoFocus={true}
          onChangeText={(text) => setPoll({ ...poll, question: text })}
          value={poll.question}
        />
        <DateSelector setPoll={setPoll} poll={poll} />
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
