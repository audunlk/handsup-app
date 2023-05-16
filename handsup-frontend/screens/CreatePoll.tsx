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
import { Ionicons as IonIcons } from "@expo/vector-icons";
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
  const [hasEmptyAnswers, setHasEmptyAnswers] = useState(false);
  const [hasDuplicateAnswers, setHasDuplicateAnswers] = useState(false);
  const [poll, setPoll] = useState({
    id: uuidv4(),
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

  const canCreatePoll = poll.question.trim() !== "" && !hasEmptyAnswers;


  useEffect(() => {
    const hasEmpty = answers.some(answer => answer.trim() === "");
    const hasDuplicate = answers.length !== new Set(answers).size;
    setHasEmptyAnswers(hasEmpty);
    setHasDuplicateAnswers(hasDuplicate);
    console.log({ hasEmpty, hasDuplicate });
  }, [answers]);

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

  const handleRemoveAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
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
      <View style={[styles.body, { paddingBottom: 40 }]}>
        <Swiper style={[styles.wrapper]}
          showsButtons={canSlide}
          loop={false}
          showsPagination={false}
          onIndexChanged={() => { hideKeyboard() }}
        >
          <TouchableWithoutFeedback onPress={hideKeyboard}>
            <View style={styles.slide1}>
              <Text style={styles.title}>Question</Text>
              <Text style={[styles.smallText, { paddingBottom: 20 }]}>What would you like to ask?</Text>
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
            <Text style={[styles.smallText, { paddingBottom: 20 }]}>When do you need a response?</Text>
            <DateSelector setPoll={setPoll} poll={poll} />
          </View>
          <View style={styles.slide3}>
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.title}>Answers</Text>
              <Text style={[styles.smallText, { paddingBottom: 20 }]}>What are the possible answers?</Text>
              {answers.map((answer, index) => (
                <View key={index} style={{ flexDirection: "row" }}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Answer ${index + 1}`}
                    placeholderTextColor={"grey"}
                    onChangeText={(text) => handleAnswerTextChange(index, text)}
                    value={answer}
                  />
                  {index >= 2 && (
                    <IonIcons
                      style={{ position: "absolute", right: 10, top: 15 }}
                      name="remove-sharp"
                      size={30}
                      color="black"
                      onPress={() => handleRemoveAnswer(index)}
                    />
                  )}
                </View>
              ))}
              {hasEmptyAnswers && (
                <Text style={{ color: "white", marginBottom: 10 }}>
                  Please provide an answer for each choice
                </Text>
              )}
              {hasDuplicateAnswers && (
                <Text style={{ color: "white", marginBottom: 10 }}>
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
              <View style={styles.listContainer}>
                {answers.map((answer, index) => (
                  <View key={index} style={{ padding: 5, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.smallText, {paddingBottom: 5}]}>Answer {index + 1}</Text>
                    <View style={{ borderRadius: 20, width: 200, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
                      <Text style={[styles.mediumText]}>{answer}</Text>
                    </View>
                  </View>
                ))}
                <Text style={[styles.smallText, {paddingBottom: 5}]}>Answer within</Text>
                <Text style={styles.mediumText}>{ISOtoReadable(poll.respond_by.toISOString())[0]}</Text>
                <Text style={styles.mediumText}>{ISOtoReadable(poll.respond_by.toISOString())[1]}</Text>
              </View>
              

              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleCreatePoll()}
                disabled={!canCreatePoll}
              >
                <Text style={styles.mediumText}>Create Poll</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.slide4}>
              <Text style={styles.mediumText}>Go back and fill out all the fields</Text>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "grey" }]}
                onPress={() => handleCreatePoll()}
                disabled={!canCreatePoll}
              >
                <Text style={styles.mediumText}>Create Poll</Text>
              </TouchableOpacity>
            </View>
          )}
        </Swiper>
        <Text
          style={[styles.smallText, { position: "absolute", bottom: 20, alignSelf: "center", paddingBottom: 20, color: "white", opacity: 0.5, zIndex: 1 }]}
        >Swipe to continue</Text>
      </View>
    </KeyboardAvoidingView>
  );
}


