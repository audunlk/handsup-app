import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../navigation/BottomNav";
import { useContext } from "react";
import { UserContext } from "../navigation/ScreenNav";
import ListItem from "../components/ListItem";
import { getGroupsByUser } from "../services/accountSetup";
import { getPollsByGroups } from "../services/pollSetup";
import AsyncStorage  from "@react-native-async-storage/async-storage";


export default function Home({ navigation, route }) {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [polls, setPolls] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setUser(token);
        }
        navigation.navigate("Login");
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
    const getPolls = async () => {
      try {
        const groups = await getGroupsByUser(user.id);
        console.log(groups);
        const group_ids = groups.map((group) => group.id);
        const userPolls = await getPollsByGroups(group_ids);
        setPolls(userPolls)
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPolls();
  }, []);


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <View style={styles.header}>
          <Text>Hi, {user.first_name}!✨</Text>
          <Ionicons
            name="ios-person"
            size={24}
            color="white"
            onPress={() => navigation.navigate("UserProfile", { user: user })}
          />
        </View>
        {/* <View style={styles.tabs}>
          <Text style={styles.tab}>Active Polls</Text>
          <Text style={styles.tab}>Expired Polls</Text>
        </View> */}
        <View style={styles.body}>
          {polls.length > 0 ? (
            polls.map((poll) => (
              <View key={poll.id}>
                <Text>{poll.question}</Text>
                <Text>{poll.created_at}</Text>
                <Text>{poll.name}</Text>
              </View>
            ))
          ): 
          (
            <Text>You have no polls yet</Text>
          )}
          <View style={styles.listContainer}></View>
        </View>
      </LinearGradient>
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 80,
    color: "white",
    flexDirection: "row",
  },
  body: {
    flex: 1,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  btn: {
    backgroundColor: "#1d9afd",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
