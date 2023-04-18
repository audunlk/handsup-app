import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { User } from "../redux/types/types";
import { setIsLoading } from "../redux/slices/loadingSlice";
import BottomNav from "../navigation/BottomNav";
import { RootState } from "../redux/types/types";
import styles from "../styles/styles";
import { setPolls } from "../redux/slices/pollSlice";
import { renderPolls } from "../utils/renderPolls";
import Loading from "./Loading";
import { getPollsByTeamSerials, getPollsByUserId, getTeamsByUserId } from "../services/firebaseRequests";


export default function Home({ navigation }) {
  const user: User = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const polls = useSelector((state: RootState) => state.polls);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active");
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const getPolls = async () => {
    try {
      const polls = await getPollsByTeamSerials(teams.map(team => team.serialKey));
      dispatch(setPolls(polls));
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
    getPolls();
  }, [dispatch, user, navigation, isContentLoaded]);

  

  
  
  const now = new Date();
  const activePolls = polls
  .filter((poll) => new Date(poll.respond_by) > now)
  .sort((a, b) => new Date(a.respond_by).getTime() - new Date(b.respond_by).getTime());

  const expiredPolls = polls
  .filter((poll) => new Date(poll.respond_by) <= now)
  .sort((a, b) => new Date(a.respond_by).getTime() - new Date(b.respond_by).getTime());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View>
        <Text style={styles.title}>{user.firstName}</Text>
          <Text style={styles.smallText}>@{user.username}</Text>
      </View>
        <Ionicons
          name="ios-person"
          size={24}
          color="white"
          onPress={() => navigation.navigate("UserProfile")}
        />
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setSelectedTab("active")}>
          <Text style={{ color: "white" }}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("expired")}>
          <Text style={{ color: "white" }}>Expired</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={selectedTab === "active" ? renderPolls(activePolls, navigation) : renderPolls(expiredPolls, navigation)}
        renderItem={({item}) => item}
        keyExtractor={(item, index) => index.toString()}
        />
        <BottomNav navigation={navigation} />
    </View>
    
  );
}

