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
  const user: User = useSelector((state: RootState) => state.user);
  const reRender = useSelector((state: RootState) => state.reRender);
  const { poll } = route.params;
  const { team } = route.params;
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState(poll.answers.map((answer: string[]) => answer));
  const [creationDate, setCreationDate] = useState(ISOtoReadable(poll.created_at))
  const [respondBy, setRespondBy] = useState(ISOtoReadable(poll.respond_by));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(0);



  useEffect(() => {
    console.log(team)
    handleCheckAnswer();
  }, [poll, user, hasAnswered, reRender, team]);

  const handleCheckAnswer = async () => {
    setIsLoading(true);

    try {
      const status = await getUserPollStatus(poll.id, user.id, poll.teamSerial);
      console.log({ status })
      setHasAnswered(status.answer)
      setIsAdmin(status.isAdmin)
    } catch (err) {
      setError(err.message);
    }finally{
      setIsLoading(false);
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

  if (isLoading) return <Loading />

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <View style={styles.body}>
        <Text style={[styles.title, {fontWeight: "bold"}]}>{poll.question}</Text>
        <Text style={styles.smallText}>Made on:</Text>
        <Text style={[styles.smallText, {marginBottom: 10}]}>{creationDate[0]} at {creationDate[1]}</Text>
        {hasAnswered ? (
          <View>
           
            <MainBtn title='See Results' onPress={() => setIsVisible(true)} />
          </View>
        ) : (
          <View>
            <Picker
              style={{ backgroundColor: 'black', width: 300, height: 215, borderRadius: 10, borderWidth: 1, borderColor: 'black', }}
              selectedValue={selectedAnswer}
              onValueChange={(value) => handleSelectAnswer(answers.indexOf(value))}
              pickerData={answers}
              itemSpace={20}
              itemStyle={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center", }}
            >
            </Picker>
            <MainBtn title="Submit" onPress={() => handleSubmitAnswer(selectedAnswer)} />
          </View>
        )}
        <MainBtn title="Chat" onPress={redirectToChat} />
        {isAdmin && (
          <MainBtn 
          title="Delete Poll"
          onPress={deleteAlert}
          />
        )}
        {isVisible && (
          <PollResults poll={poll} team={team} isVisible={isVisible} setIsVisible={setIsVisible} hasAnswered={hasAnswered}/>
        )}
      </View>
    </View>
  );
};


