import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Header from "../components/Header";
import { RootState } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getTeamsByUserId } from "../services/teamRequests";
import BottomNav from "../navigation/BottomNav";
import Loading from "./Loading";
import JoinTeam from "./JoinTeam";
import CreateTeam from "./CreateTeam";
import { handleRenderTeams } from "../utils/renderTeams";
import { RefreshControl } from "react-native-gesture-handler";



export default function Teams({ navigation }) {
  const dispatch = useDispatch();
  const reRender = useSelector((state: RootState) => state.reRender);
  const user = useSelector((state: RootState) => state.user);
  const [renderView, setRenderView] = useState(null); 
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(null);

  
  useEffect(() => {
    setIsLoading(true);
    if(user.id){
      defineTeams();
    }
    setIsLoading(false);
  }, [user, reRender]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    defineTeams();
    setRefreshing(false);
  }, [refreshing]);


  const defineTeams = async () => {
    try {
      const teams = await getTeamsByUserId(user.id);
      const renderView = handleRenderTeams(teams, navigation);
      setRenderView(renderView);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  

  if(isLoading) return <Loading />

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={"Your teams"} showExit={true} />
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setIsVisible("join")}>
          <Text style={{ color: "white" }}>Join Team</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible("create")}>
          <Text style={{ color: "white" }}>Create Team</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.body}>
      <View style={styles.listContainer}>{renderView}</View>
      </ScrollView>
      <BottomNav navigation={navigation} />
      {isVisible === "join" && <JoinTeam isVisible={true} setIsVisible={setIsVisible} /> }
      {isVisible === "create" && <CreateTeam isVisible={true} setIsVisible={setIsVisible} /> }
    </View>
  );
}
