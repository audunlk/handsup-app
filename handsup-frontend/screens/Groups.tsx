import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Header from "../components/Header";
import { RootState } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getTeamsByUserId } from "../services/firebaseRequests";
import BottomNav from "../navigation/BottomNav";
import ProfilePicture from "../components/ProfilePicture";
import Loading from "./Loading";
import LottieView from 'lottie-react-native';
import JoinTeam from "./JoinTeam";
import CreateTeam from "./CreateTeam";


export default function Teams({ navigation }) {
  const dispatch = useDispatch();
  const reRender = useSelector((state: RootState) => state.reRender);
  const user = useSelector((state: RootState) => state.user);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    console.log(user);
    console.log("user in teams");
    if(user.id){
      defineTeams();
    }
    setIsLoading(false);
  }, [user, reRender]);

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
    if(teams.length === 0) return (
      <View style={[styles.body]}>
        <LottieView
          source={require("../assets/animations/empty.json")}
          autoPlay
          loop
          style={{
            width: 300,
            height: 300,
          
          }}
        />
        <Text style={[styles.mediumText, {color: "#FFA500", fontWeight: "bold"}]}>Join or Create a team to get started!</Text>
        <Text style={[styles.smallText, {color: "#FFA500"}]}>Your teams will appear here.</Text>
      </View>
    )
    return teams.map((team, i) => {
      return (
        <View style={styles.listItem} key={i}>
          <ProfilePicture id={team.serialKey} size={50} type={"team"} allowPress={false} />
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
    setIsVisible("create");
  };
  const handleJoinTeam = () => {
    setIsVisible("join");
  };
  

  if(isLoading) return <Loading />

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
      <ScrollView
      >
      <View style={styles.listContainer}>{handleRenderTeams()}</View>
      </ScrollView>
      <BottomNav navigation={navigation} />
      {isVisible === "join" && <JoinTeam  navigation={navigation} isVisible={true} setIsVisible={setIsVisible} /> }
      {isVisible === "create" && <CreateTeam navigation={navigation} isVisible={true} setIsVisible={setIsVisible} /> }
    </View>
  );
}
