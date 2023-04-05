import React, { useEffect, useState, useContext } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import {
  getAnswerChoices,
  deletePoll,
  getAdminsByGroup,
} from "../services/pollSetup";
import { ISOtoReadable } from "../utils/dateConversion";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../screens/Loading";
import { useSelector } from "react-redux";
import { RootState, User } from "../redux/types/types";
import Header from "./Header";
import styles from "../styles/styles";
import { createPollResponse, insertResponseChoice } from "../services/pollResponseSetup";

export default function PollCard({ route, navigation }) {
  const [answers, setAnswers] = useState([]);
  const [creationDate, setCreationDate] = useState([]);
  const [respondBy, setRespondBy] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { poll } = route.params;
  // user from usecontext
  const user: User = useSelector((state: RootState) => state.user);

  const getAnswers = async (id: Number) => {
    try {
      const answerChoices = await getAnswerChoices(id);
      setAnswers(answerChoices);
      //make the UTCisostring to readable date
      const creationDate = ISOtoReadable(poll.created_at);
      const respondBy = ISOtoReadable(poll.respond_by);
      setCreationDate(creationDate);
      setRespondBy(respondBy);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAdmins = async (id: Number) => {
    try {
      const admins = await getAdminsByGroup(id);
      const isAdmin = admins.find((admin: any) => admin.id === user.id);
      setIsAdmin(isAdmin);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAdmins(poll.group_id);
    getAnswers(poll.id);
  }, [poll]);

  const handleDeletePoll = async () => {
    try {
      await deletePoll(poll.id);
      navigation.navigate("Home");
      Alert.alert("Poll Deleted");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletionAlert = async () => {
    setIsLoading(true);
    Alert.alert(
      "Are you sure you want to delete this poll?",
      "This action cannot be undone",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDeletePoll() },
      ],
      { cancelable: false }
    );
  };

  const handleSelectAnswer = async (answer_id: Number, poll_id: Number, user_id: Number) => {
    try {
      const pollResponse = await createPollResponse(user_id, poll_id);
      console.log(pollResponse.id + "response id")
      console.log(pollResponse)
      if(pollResponse.error) throw new Error(pollResponse.error)
      const choiceResponse = await insertResponseChoice(pollResponse.id, answer_id);
      console.log(choiceResponse)
      if(choiceResponse.error) throw new Error(choiceResponse.error)
      
      console.log(pollResponse)
      navigation.navigate("Home");
      Alert.alert("Answer Selected");
    } catch (error) {
      setError(error.message);
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={null} showExit={true} />
      <View style={styles.body}>
        <Text>{poll.question}</Text>
        <Text style={{ color: "red" }}>{poll.description}</Text>
        <Text style={styles.smallText}>Created At:</Text>
        <Text style={styles.smallText}>{creationDate[0]}</Text>
        <Text style={styles.smallText}>{creationDate[1]}</Text>
        <Text style={styles.smallText}>Respond By:</Text>
        <Text style={styles.smallText}>{respondBy[0]}</Text>
        <Text style={styles.smallText}>{respondBy[1]}</Text>
        <Text style={styles.smallText}>{poll.group_id}</Text>
        <View style={styles.twoByTwo}>
          {answers.map((answer, index) => {
            return (
              <View
                key={index}
              >
                <TouchableOpacity style={styles.btn}
                  onPress={() => handleSelectAnswer(answer.id, poll.id, user.id)}
                >
                  <Text>{answer.text}{answer.id}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
      {/* Delete icon */}
      {isAdmin && (
        <IonIcons
          name="trash"
          size={30}
          color="red"
          onPress={handleDeletionAlert}
        />
      )}
    </View>
  );
}
