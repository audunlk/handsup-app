import React, { useEffect, useState, useContext } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { getAnswerChoices, deletePoll, getAdminsByGroup } from "../services/pollSetup";
import { ISOtoReadable } from "../utils/dateConversion";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../screens/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../redux/types/types";
import { User } from "../redux/types/types";
import Header from "./Header";
import styles from "../styles/styles";



export default function PollCard({ route, navigation }) {
  const [answers, setAnswers] = useState([]);
  const [creationDate, setCreationDate] = useState([]);
  const [respondBy, setRespondBy] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { poll } = route.params;
  // user from usecontext
  const user = useSelector((state: RootState) => state.user);
  const getAnswers = async (id: Number) => {
    try {
      const answerChoices = await getAnswerChoices(id);
      setAnswers(answerChoices);
      setCreationDate(ISOtoReadable(poll.created_at));
      setRespondBy(ISOtoReadable(poll.respond_by));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAdmins = async (id: Number) => {
    try {
      const admins = await getAdminsByGroup(id);
      console.log({admins})
      const isAdmin = admins.find((admin) => admin.id === user.id);
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
    console.log(isAdmin)
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <Header navigation={navigation} title={null} showExit={true} />
      <Text>{poll.question}</Text>
      <Text style={{ color: "red" }}>{poll.description}</Text>
      <Text>Created At:</Text>
      <Text>{creationDate[0]}</Text>
      <Text>{creationDate[1]}</Text>
      <Text>Respond By:</Text>
      <Text>{respondBy[0]}</Text>
      <Text>{respondBy[1]}</Text>
      <Text>{poll.group_id}</Text>
      <View style={styles.twoByTwo}>
        {answers.map((answer, index) => {
          return (
            <View style={styles.twoByTwoItem} key={index}
            >
              <TouchableOpacity  style={styles.btn}>
                <Text >{answer.text}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {/* Delete icon */}
      {isAdmin && (
        <IonIcons
        name="trash"
        size={30}
        color="red"
        onPress={handleDeletionAlert}
      />
      )
      }
    </View>
  );
}
