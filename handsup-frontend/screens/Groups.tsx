import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { RootState } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getTeamsByUserId } from "../services/firebaseRequests";
import BottomNav from "../navigation/BottomNav";
import { Ionicons } from "@expo/vector-icons";

export default function Teams({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(user);
    console.log("user in teams");
    if(user.id){
      defineTeams();
    }
  }, [user]);

  const defineTeams = async () => {
    console.log("defining teams")
    try {
      const teams = await getTeamsByUserId(user.id);
      console.log(teams + "teams");
      setTeams(teams);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
    }
  };


  const handleRenderTeams = () => {
    return teams.map((team, i) => {
      return (
        <View style={styles.listItem} key={i}>
          <Ionicons name="ios-people-circle-outline" size={50} color="black" />  
          <TouchableOpacity
            key={team.id}
            onPress={() => navigation.navigate("GroupInfo", { team })}
          >
            <Text style={styles.listTitle}>{team.name}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const handleCreateTeam = () => {
    navigation.navigate("CreateTeam");
  };
  const handleJoinTeam = () => {
    navigation.navigate("JoinTeam", { user: user });
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={"Your teams"} showExit={true} />
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => handleJoinTeam()}>
          <Text style={{ color: "white" }}>Join Team</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCreateTeam()}>
          <Text style={{ color: "white" }}>Create Team</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>{handleRenderTeams()}</View>
      <BottomNav navigation={navigation} />

    </View>
  );
}
