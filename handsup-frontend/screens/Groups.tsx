import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { getGroupsByUser } from "../services/accountSetup";
import ListItem from "../components/ListItem";
import { RootState } from "../redux/types/types";
import { useSelector } from "react-redux";
import styles from "../styles/styles";

export default function Groups({ navigation }) {
  const user = useSelector((state: RootState) => state.user);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(user);
    console.log("user in groups");
    defineGroups();
  }, []);

  const defineGroups = async () => {
    try {
      const groups = await getGroupsByUser(user.id);
      console.log(groups);
      setGroups(groups);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
    }
  };

  const openInfo = () => {
    console.log("open info");
  };

  const handleRenderGroups = () => {
    return groups.map((group) => {
      return (
        <View style={styles.listItem}>
          <TouchableOpacity
            key={group.id}
            onPress={() => navigation.navigate("GroupInfo", { group: group })}
          >
            <Text style={styles.listTitle}>{group.name}</Text>
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
      <Header navigation={navigation} title={"Your Groups"} showExit={true} />
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => handleJoinTeam()}>
          <Text style={{ color: "white" }}>Join Team</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCreateTeam()}>
          <Text style={{ color: "white" }}>Create Team</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>{handleRenderGroups()}</View>
    </View>
  );
}
