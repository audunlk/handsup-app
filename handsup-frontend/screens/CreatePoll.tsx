import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from "react-native";
import DateSelector from "../components/DateSelector";
import { User, RootState } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { createPoll } from "../services/pollRequests";
import { createPollChat } from "../services/chatRequests";
import { getAllPushTokens } from "../services/userRequests";
import 'react-native-get-random-values';
import styles from "../styles/styles";
import { v4 as uuidv4 } from "uuid";
import Swiper from "react-native-swiper";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ISOtoReadable } from "../utils/dateConversion";
import { Picker } from "react-native-wheel-pick";
import { triggerReRender } from "../redux/slices/reRenderSlice";
import { schedulePushNotification } from "../services/pushNotifications";
import Loading from "./Loading";

export default function CreatePoll({ navigation, route }) {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.user);
  const reRender = useSelector((state: RootState) => state.reRender);
  const [team, setTeam] = useState(route.params.team);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [canSlide, setCanSlide] = useState(false);
  const [answers, setAnswers] = useState(["", ""]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
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
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log(team);
  }, [team]);

  const hasEmptyAnswers = answers.some(answer => answer.trim() === "");
  const canCreatePoll = poll.question.trim() !== "" && !hasEmptyAnswers;
  const hasDuplicateAnswers = answers.length !== new Set(answers).size;
  console.log(hasDuplicateAnswers + "duplicate naswer");

  const handleCreatePoll = async () => {
    console.log("creating poll")
    try {
      const pollData = {
        id: poll.id,
        question: poll.question,
        created_at: poll.created_at.toISOString(),
        respond_by: poll.respond_by.toISOString(),
        teamSerial: poll.teamSerial,
        teamName: team.name,
        answers: answers,
        anonymous: false,
      };
      console.log(pollData)
      const pollResponse = await createPoll(pollData)
      await createPollChat(poll.id, user.id);
      console.log(pollResponse);
      if (pollResponse) {
        await handleSendPushNotification();
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

  const handleSendPushNotification = async () => {
    setIsLoading(true);
    try {
      const tokens = await getAllPushTokens(team.serialKey)
      tokens.forEach(async (token) => {
        if (!token) {
          return;
        }
        await schedulePushNotification(token, "New Question", poll.question, { seconds: 5 });
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  const hideKeyboard = () => {
    Keyboard.dismiss();

  }

  isLoading && <Loading />;


  //make a swiper for each input
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <View style={[styles.body, {paddingBottom: 40}]}>
        <Swiper style={[styles.wrapper]}
          showsButtons={canSlide}
          loop={false}
          showsPagination={false}          
          onIndexChanged={() => {hideKeyboard()}}
        >
          <TouchableWithoutFeedback onPress={hideKeyboard}>
            <View style={styles.slide1}>
              <Text style={styles.title}>Question</Text>
              <Text style={[styles.smallText, {paddingBottom: 20}]}>What would you like to ask?</Text>
              <TextInput
                placeholder="Question"
                style={styles.input}
                onChangeText={(text) => setPoll({ ...poll, question: text })}
                value={poll.question}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.slide2}>
            <Text style={styles.title}>When?</Text>
            <Text style={[styles.smallText, {paddingBottom: 20}]}>When do you need a response?</Text>
            <DateSelector setPoll={setPoll} poll={poll} />
          </View>
          <View style={styles.slide3}>
            <ScrollView style={{flex: 1}}>
              <Text style={styles.title}>Answers</Text>
              <Text style={[styles.smallText, {paddingBottom: 20}]}>What are the possible answers?</Text>
              {answers.map((answer, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder={`Answer ${index + 1}`}
                  onChangeText={(text) => handleAnswerTextChange(index, text)}
                  value={answer}
                />
              ))}
              {hasEmptyAnswers || hasDuplicateAnswers && (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  Please provide an unique answer for each choice
                </Text>
              )}
              {answers.length < 5 && (
                <TouchableOpacity style={styles.btn} onPress={handleAddAnswer}>
                  <Text style={styles.mediumText}>Add Answer</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          {canCreatePoll ? (
            <View style={styles.slide4}>
            <Text style={styles.smallText}>Question</Text>
            <Text style={[styles.largeText, { textAlign: "center" }]}>{poll.question}</Text>
            
            <Picker
              style={{ backgroundColor: 'black', width: 300, height: 215, borderRadius: 10, borderWidth: 1, borderColor: 'black', paddingHorizontal: 20}}
              pickerData={answers}
              onValueChange={(value) => {
                console.log(value);
              }}
              itemSpace={20}
              backgroundColor={'#FFFFFF'}
              itemStyle={{ color: 'white', fontSize: 20 }}
            >
            </Picker>
            <Text style={styles.smallText}>Answer within</Text>
            <Text style={styles.mediumText}>{ISOtoReadable(poll.respond_by.toISOString())[0]}</Text>
            <Text style={styles.mediumText}>{ISOtoReadable(poll.respond_by.toISOString())[1]}</Text>
            
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleCreatePoll()}
              disabled={!canCreatePoll}
            >
              <Text style={styles.mediumText}>Create Poll</Text>
            </TouchableOpacity>
          </View>
            ): (
              <View style={styles.slide4}>
                <Text style={styles.mediumText}>Go back and fill out all the fields</Text>
                <TouchableOpacity
              style={[styles.btn, {backgroundColor: "grey"}]}
              onPress={() => handleCreatePoll()}
              disabled={!canCreatePoll}
            >
              <Text style={styles.mediumText}>Create Poll</Text>
            </TouchableOpacity>
                </View>
            )}

          
        </Swiper>
        <Text 
        style={[styles.smallText, {position: "relative", bottom: 0, alignSelf: "center", paddingBottom: 20, color: "white", opacity: 0.5, zIndex: 1}]}
        >Swipe to continue</Text>
      </View>
    </KeyboardAvoidingView>
  );
}


