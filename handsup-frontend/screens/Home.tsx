import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Touchable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getGroupsByUser } from "../services/accountSetup";
import { getPollsByGroups } from "../services/pollSetup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { User } from "../redux/types/types";
import { setIsLoading } from "../redux/slices/loadingSlice";

import BottomNav from "../navigation/BottomNav";
import MainBtn from "../components/MainBtn";
import { RootState } from "../redux/types/types";
import styles from "../styles/styles";
import { ListItem } from "@rneui/base";

export default function Home({ navigation }) {
  const user: User = useSelector((state: RootState) => state.user);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [polls, setPolls] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active");
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    const getPolls = async () => {
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
        //in response to dispatch in screenNav in checkToken
        dispatch(setIsLoading(false));
        setIsContentLoaded(true);
      }
    };
    if (user) {
      getPolls();
    }
  }, [dispatch, user]);

  if (isLoading || !isContentLoaded) {
    return <ActivityIndicator />;
  }

  const now = new Date();
  const activePolls = polls.filter((poll) => new Date(poll.respond_by) > now);
  const expiredPolls = polls.filter((poll) => new Date(poll.respond_by) <= now);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{user.username}</Text>
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
              <View style={styles.listItem}>
                <TouchableOpacity
                  key={poll.id}
                  
                  onPress={() => navigation.navigate("PollCard", { poll: poll })}
                  >
                  <Text style={styles.listTitle}>{poll.name}</Text>
                  <Text style={styles.listDescription}>{poll.question}</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            expiredPolls.map((poll) => (
              <View style={styles.listItem}>
                <TouchableOpacity
                  key={poll.id}
                  
                  onPress={() => navigation.navigate("PollCard", { poll: poll })}
                  >
                  <Text style={styles.listTitle}>{poll.name}</Text>
                  <Text style={styles.listDescription}>{poll.question}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
}
