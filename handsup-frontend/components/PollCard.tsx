import React, { useEffect, useState, useContext } from "react";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { Picker } from "react-native-wheel-pick";
import { ISOtoReadable } from "../utils/dateConversion";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../screens/Loading";
import { useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import { RootState, User } from "../redux/types/types";
import { useDispatch } from "react-redux";
import Header from "./Header";
import styles from "../styles/styles";
import { hasUserAnsweredPoll, insertAnswer } from "../services/firebaseRequests";


export default function PollCard({ route, navigation }) {
  const { poll } = route.params;
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState(poll.answer_choices.map((answer: any) => answer));
  const [creationDate, setCreationDate] = useState(ISOtoReadable(poll.created_at))
  const [respondBy, setRespondBy] = useState(ISOtoReadable(poll.respond_by));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(answers[0]);

  const user: User = useSelector((state: RootState) => state.user);

  useEffect(() => {
    handleCheckAnswer();
    console.log(user)
    console.log({ poll })
    
    console.log(selectedAnswer)
    console.log("poll card")
  }, [poll, user, hasAnswered]);

  const handleCheckAnswer = async () => {
    setIsLoading(true);
    try {
      //function returns actual answer or false
      const givenAnswer = await hasUserAnsweredPoll(poll.id, user.id);
      if (givenAnswer) {
        setHasAnswered(givenAnswer);
      }
    } catch (error) {
      console.log(error)
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleSubmitAnswer = async (answer: string) => {
    try {
      await insertAnswer(poll.id, user.id, answer);
      setHasAnswered(answer);
    } catch (error) {
      console.log(error)
      setError(error.message);
    }
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    console.log(answer)
  };

  if(isLoading){
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={poll.question} showExit={true} />
      <View style={styles.body}>
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
          //style={styles.pickerContainer}
          >
            <Picker
              style={{ backgroundColor: 'white', width: 300, height: 215, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}
              selectedValue={selectedAnswer}
              onValueChange={(value) => handleSelectAnswer(value)}
              pickerData={answers}
            >
            </Picker>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.smallText} onPress={() => handleSubmitAnswer(selectedAnswer)}>Submit</Text>
            </TouchableOpacity>
          </View>

        )}

        {isAdmin && (
          <IonIcons
            name="trash"
            size={30}
            color="red"
          //onPress={handleDeletionAlert}
          />
        )}
      </View>
    </View>
  );
};


