import React, { useEffect, useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { Picker } from "react-native-wheel-pick";
import { ISOtoReadable } from "../utils/dateConversion";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../screens/Loading";
import { useSelector } from "react-redux";
import { RootState, User } from "../redux/types/types";
import { useDispatch } from "react-redux";
import Header from "./Header";
import styles from "../styles/styles";
import { deletePoll } from "../services/pollRequests";
import { addAnswer, getUserPollStatus } from "../services/answerRequests";
import MainBtn from "./MainBtn";
import PollResults from "./PollResults";
import { triggerReRender } from "../redux/slices/reRenderSlice";


export default function PollCard({ route, navigation }) {
  const { poll } = route.params;
  const { team } = route.params;
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState(poll.answers.map((answer: any) => answer));
  const [creationDate, setCreationDate] = useState(ISOtoReadable(poll.created_at))
  const [respondBy, setRespondBy] = useState(ISOtoReadable(poll.respond_by));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(0);

  const user: User = useSelector((state: RootState) => state.user);
  const reRender = useSelector((state: RootState) => state.reRender);

  
  useEffect(() => {
    console.log(team)
    setIsLoading(true);
    handleCheckAnswer();
    setIsLoading(false);
  }, [poll, user, hasAnswered, reRender, team]);

  const handleCheckAnswer = async () => {
    try {
      const status = await getUserPollStatus(poll.id, user.id, poll.teamSerial);
      console.log({ status })
      setHasAnswered(status.answer)
      setIsAdmin(status.isAdmin)
    } catch (err) {
      setError(err.message);
    }
  }

  const handleSubmitAnswer = async (answerIndex: number) => {
    try {
      await addAnswer(poll.id, answerIndex, user.id);
      setHasAnswered(answers[answerIndex]);
      dispatch(triggerReRender(!reRender))
    } catch (error) {
      console.log(error)
      setError(error.message);
    }
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    console.log(selectedAnswer);
  };

  const redirectToChat = () => {
    navigation.navigate("Chat", { poll, pollId: poll.id, name: poll.question });
  };

  const handleDeletePoll = async () => {
    try {
      await deletePoll(poll.id);
      dispatch(triggerReRender(!reRender))
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    }
  }

  const deleteAlert = () => {
    Alert.alert(
      "Delete Poll",
      "Are you sure you want to delete this poll?",
      [{
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => handleDeletePoll(),
      },
      ],
      { cancelable: false }
    );
  };

  if(isLoading) return <Loading />

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={poll.question} showExit={true} />
      <View style={styles.body}>
        <Text style={styles.mediumText}>{team.name}</Text>
        <Text style={styles.smallText}>Created At:</Text>
        <Text style={styles.smallText}>{creationDate[0]}</Text>
        <Text style={styles.smallText}>{creationDate[1]}</Text>
        <Text style={styles.smallText}>Respond By:</Text>
        <Text style={styles.smallText}>{respondBy[0]}</Text>
        <Text style={styles.smallText}>{respondBy[1]}</Text>
        <Text style={styles.smallText}>{poll.group_id}</Text>
        {hasAnswered ? (
          <Text style={styles.smallText}>Your answer: {hasAnswered}</Text>
        ) : (
          <View
          >
            <Picker
              style={{ backgroundColor: 'black', width: 300, height: 215, borderRadius: 10, borderWidth: 1, borderColor: 'black', }}
              selectedValue={selectedAnswer}
              onValueChange={(value) => handleSelectAnswer(answers.indexOf(value))}
              pickerData={answers}
              itemSpace={20}
              itemStyle={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center", }}
            >
            </Picker>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.smallText} onPress={() => handleSubmitAnswer(selectedAnswer)}>Submit</Text>
            </TouchableOpacity>
          </View>

        )}
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.smallText} onPress={() => setIsVisible(true)}>See Results</Text>
        </TouchableOpacity>
        <MainBtn title="Chat" onPress={redirectToChat} />
        {isAdmin && (
          <IonIcons
            name="trash"
            size={30}
            color="red"
            onPress={deleteAlert}
          />
        )}
        {isVisible === true && (
          <PollResults poll={poll} team={team} isVisible={isVisible} setIsVisible={setIsVisible} />
        )
        }
      </View>
    </View>
  );
};


