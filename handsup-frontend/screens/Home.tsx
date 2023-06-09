import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Poll, User } from "../redux/types/types";
import BottomNav from "../navigation/BottomNav";
import { RootState } from "../redux/types/types";
import styles from "../styles/styles";
import { setPolls } from "../redux/slices/pollSlice";
import { renderPolls } from "../utils/renderPolls";
import { getPollsByTeamSerials, getTeamsByUserId, getUserObject, getUserPollStatus } from "../services/firebaseRequests";
import ProfilePicture from "../components/ProfilePicture";
import LottieView from "lottie-react-native";


export default function Home({ navigation }) {
  const user: User = useSelector((state: RootState) => state.user);
  //const polls = useSelector((state: RootState) => state.polls);
  const reRender = useSelector((state: RootState) => state.reRender);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [teams, setTeams] = useState([]);
  const [polls, setPolls] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedTab, setSelectedTab] = useState("active");
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const getUnansweredPolls = async () => {
    try {
      const polls = await getPollsByTeamSerials(teams.map(team => team.serialKey));
      const pollStatusPromises = polls.map(poll => getUserPollStatus(poll.id, user.id, poll.teamSerial));
      const pollStatuses = await Promise.all(pollStatusPromises);
      const unansweredPolls = polls.filter((poll, index) => !pollStatuses[index].answer);
      setPolls(unansweredPolls);
      setIsContentLoaded(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const getTeams = async () => {
    try {
      const teams = await getTeamsByUserId(user.id);
      setTeams(teams);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  useEffect(() => {
    console.log("use effect ran");
    getTeams();
    getUnansweredPolls();
    console.log(reRender)
  }, [dispatch, user, navigation, isContentLoaded, reRender]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTeams();
    getUnansweredPolls();
    setRefreshing(false);
  }, []);


  const now = new Date();
  const activePolls = polls
    .filter((poll) => new Date(poll.respond_by) > now)
    .sort((a, b) => new Date(a.respond_by).getTime() - new Date(b.respond_by).getTime());


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <ProfilePicture id={user.id} size={50} type={"user"} allowPress={false} />
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.title}>{user.firstName}</Text>
            <Text style={styles.smallText}>@{user.username}</Text>
          </View>
        </View>
        <Ionicons
          name="ios-person"
          size={24}
          color="white"
          onPress={() => navigation.navigate("UserProfile")}
        />
      </View>
      {activePolls.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.body}>
          <LottieView
            source={require("../assets/animations/relax.json")}
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <Text style={styles.mediumText}>No polls in need of your attention</Text>
          <Text style={styles.smallText}>Pull down to refresh</Text>
        </ScrollView>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={renderPolls(activePolls, navigation, teams)}
          renderItem={({ item }) => item}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <BottomNav navigation={navigation} />
    </View>
  );
}

