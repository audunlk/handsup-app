import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import DateSelector from "../components/DateSelector";
import { User, RootState, Poll } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { createPoll, createPollChat } from "../services/firebaseRequests";
import 'react-native-get-random-values';
import styles from "../styles/styles";
import { v4 as uuidv4 } from "uuid";
import Swiper from "react-native-swiper";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ISOtoReadable } from "../utils/dateConversion";
import { Picker } from "react-native-wheel-pick";
import { triggerReRender } from "../redux/slices/reRenderSlice";

export default function CreatePoll({ navigation, route }) {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.user);
  const reRender = useSelector((state: RootState) => state.reRender);
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
    const answerChoiceData = answers.map(answer => ({
      answer_choice: answer,
      membersAnswered: []
    }));
    try {
      const pollData = {
        id: poll.id,
        question: poll.question,
        created_at: poll.created_at.toISOString(),
        respond_by: poll.respond_by.toISOString(),
        teamSerial: poll.teamSerial,
        teamName: team.name,
        answer_choices: answerChoiceData,
        anonymous: false,
      };
      console.log(pollData)
      const pollResponse = await createPoll(pollData)
      await createPollChat(poll.id, user.id);
      console.log(pollResponse);
      if(pollResponse) {
      dispatch(triggerReRender(!reRender))
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

  //make a swiper for each input
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <Swiper style={styles.wrapper} 
      showsButtons={true} 
      loop={false} 
      showsPagination={false} 
      buttonWrapperStyle={styles.buttonWrapper}
      nextButton={
        <IonIcons name="arrow-forward-outline" size={30} color="white" />
      }
      prevButton={
        <IonIcons name="arrow-back-outline" size={30} color="white" />
      }
      >
        <View style={styles.slide1}>
          <Text style={styles.mediumText}>Question</Text>
          <TextInput
            placeholder="Question"
            style={styles.input}
            autoFocus={true}
            onChangeText={(text) => setPoll({ ...poll, question: text })}
            value={poll.question}
          />
        </View>
        <View style={styles.slide2}>
          <Text style={styles.mediumText}>Respond By</Text>
          <DateSelector setPoll={setPoll} poll={poll} />
        </View>
        <View style={styles.slide3}>
          <Text style={styles.mediumText}>Answers</Text>
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
        </View>
        <View style={styles.slide4}>
          <Text style={styles.mediumText}>Question</Text>
          <Text style={[styles.largeText, {textAlign: "center"}]}>{poll.question}</Text>
            <Text style={styles.mediumText}>Respond By</Text>
            <Text style={styles.mediumText}>{ISOtoReadable(poll.respond_by.toISOString())[0]}</Text>
            <Text style={styles.mediumText}>{ISOtoReadable(poll.respond_by.toISOString())[1]}</Text>
            <Text style={styles.mediumText}>Answers</Text>
            <Picker
              style={{ backgroundColor: 'black', width: 300, height: 215, borderRadius: 10, borderWidth: 1, borderColor: 'black',}}
              pickerData={answers}
              onValueChange={(value) => {
                console.log(value);
              }}
              itemSpace={20}
              backgroundColor={'#FFFFFF'}
              itemStyle={{ color: 'white', fontSize: 20 }}
            >
            </Picker>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleCreatePoll()}
            disabled={!canCreatePoll}
          >
            <Text style={styles.mediumText}>Create Poll</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    </KeyboardAvoidingView>
  );
}




// return (
//   <View style={styles.container}>
//     <Header navigation={navigation} title={team.name} showExit={true} />
//     <ScrollView contentContainerStyle={[styles.scrollBody]}>
//       <Text style={styles.mediumText}>Question</Text>
//       <TextInput
//         placeholder="Question"
//         style={styles.input}
//         autoFocus={true}
//         onChangeText={(text) => setPoll({ ...poll, question: text })}
//         value={poll.question}
//       />
//       <View>
//         <Text style={styles.mediumText}>Respond By</Text>
//         <DateSelector setPoll={setPoll} poll={poll} />
//       </View>
//       {answers.map((answer, index) => (
//         <TextInput
//           key={index}
//           style={styles.input}
//           placeholder={`Answer ${index + 1}`}
//           onChangeText={(text) => handleAnswerTextChange(index, text)}
//           value={answer}
//         />
//       ))}
//       {hasEmptyAnswers && (
//         <Text style={{ color: "red", marginBottom: 10 }}>
//           Please provide an answer for each choice
//         </Text>
//       )}
//       <TouchableOpacity style={styles.btn} onPress={handleAddAnswer}>
//         <Text style={styles.mediumText}>Add Answer</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.btn}
//         onPress={
//           () => handleCreatePoll()
//         }
//         disabled={!canCreatePoll}
//       >
//         <Text style={styles.mediumText}>Create Poll</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   </View>
// );