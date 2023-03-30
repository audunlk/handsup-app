import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { UserContext } from "../navigation/ScreenNav";
import { getGroupsByUser } from "../services/accountSetup";
import { getPollsByGroups } from "../services/pollSetup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import BottomNav from "../navigation/BottomNav";
import MainBtn from "../components/MainBtn";
import { RootState } from "../redux/store/types";

export default function Home({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [polls, setPolls] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active");

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          dispatch(setUser(token));
        }
        navigation.navigate("Login");
      } catch (error) {
        console.log(error);
      } 
    };
    getToken();
  }, [dispatch, navigation]);

  useEffect(() => {
    const getPolls = async () => {
      try {
        const user = useSelector((state: RootState) => state.user);
        const groups = await getGroupsByUser(user.id);
        console.log(groups);
        const group_ids = groups.map((group) => group.id);
        const userPolls = await getPollsByGroups(group_ids);
        setPolls(userPolls);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPolls();
    console.log(polls);
  }, [navigation]);

  const now = new Date();
  const activePolls = polls.filter((poll) => new Date(poll.respond_by) > now);
  const expiredPolls = polls.filter((poll) => new Date(poll.respond_by) <= now);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <View style={styles.header}>
          <Text>{user.first_name}</Text>
          <Ionicons
            name="ios-person"
            size={24}
            color="white"
            onPress={() => navigation.navigate("UserProfile", { user: user })}
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
        <View style={styles.body}>
          <View style={styles.listContainer}>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : selectedTab === "active" ? (
              activePolls.map((poll) => (
                <View>
                  <Text>{poll.name}</Text>
                  <MainBtn
                    key={poll.id}
                    title={poll.question}
                    onPress={() =>
                      navigation.navigate("PollCard", { poll: poll })
                    }
                  />
                </View>
              ))
            ) : (
              expiredPolls.map((poll) => (
                <MainBtn
                  key={poll.id}
                  title={poll.question}
                  onPress={() =>
                    navigation.navigate("PollCard", { poll: poll })
                  }
                />
              ))
            )}
          </View>
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
  tabs: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    color: "white",
    flexDirection: "row",
    width: "100%",
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
