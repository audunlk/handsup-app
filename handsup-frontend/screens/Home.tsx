import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getGroupsByUser } from "../services/accountSetup";
import { getPollsByGroups } from "../services/pollSetup";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { User } from "../redux/types/types";
import { setIsLoading } from "../redux/slices/loadingSlice";

import BottomNav from "../navigation/BottomNav";
import MainBtn from "../components/MainBtn";
import { RootState } from "../redux/types/types";
import { setUser } from "../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const user = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [polls, setPolls] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active");

 useEffect(() => {
  const decodeToken = async () => {
    const token = await AsyncStorage.getItem("handsup-token");
    if(!token){
      navigation.navigate("Login")
    }
    const decodedUser = jwtDecode(token);
    console.log({decodedUser})
    dispatch(setUser(decodedUser as User));
  };
  console.log(user)
  decodeToken();
}, [navigation]);




  useEffect(() => {
    if(!user){
      return;
    }
    const getPolls = async () => {
      dispatch(setIsLoading(true));
      try {
        const groups = await getGroupsByUser(user.id);
        console.log(groups);
        const group_ids = groups.map((group: any) => group.id);
        const userPolls = await getPollsByGroups(group_ids);
        setPolls(userPolls);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    getPolls();
    console.log(polls);
  }, [navigation, user, dispatch]);

  const now = new Date();
  const activePolls = polls.filter((poll) => new Date(poll.respond_by) > now);
  const expiredPolls = polls.filter((poll) => new Date(poll.respond_by) <= now);


  if(isLoading){
    return <Text>Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <View style={styles.header}>
          <Text>{user.first_name} ! </Text>
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
