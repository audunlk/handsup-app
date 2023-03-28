import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Header from "../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons as IonIcons } from "@expo/vector-icons";
import { getPollsByGroup } from "../services/pollSetup";
import ListItem from "../components/ListItem";
import MainBtn from "../components/MainBtn";

export default function GroupInfo({ navigation, route }) {
  const { group } = route.params;
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    console.log(group);
    console.log("group in group info");
    listPollsInGroup();
  }, []);

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(group.serialkey);
    Alert.alert(`Copied to clipboard`);
  };

  const listPollsInGroup = async () => {
    const listPolls = await getPollsByGroup(group.id);
    console.log({ listPolls });
    setPolls(listPolls);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <Header navigation={navigation} title={group.name} showExit={false} />
        <View style={styles.body}>
          <Text style={styles.title}>
            {group.is_admin ? "Leader" : "Member"}
          </Text>
          {group.is_admin && (
            <View>
              <Text style={styles.title}>Invitation Key:</Text>
              <TouchableOpacity
                style={styles.serialBox}
                onPress={copyToClipboard}
              >
                <TextInput
                  value={group.serialkey}
                  caretHidden={true}
                  autoCorrect={false}
                  editable={false}
                />
                <IonIcons name="copy-outline" size={24} color="black" />
              </TouchableOpacity>
              <View>
                <MainBtn
                  title="Add Poll"
                  onPress={() => navigation.navigate("CreatePoll", { group })}
                />
              </View>
            </View>
          )}

          <View>
            <Text style={styles.title}>Active Polls</Text>
            {polls.map((poll) => (
              <ListItem
                key={poll.id}
                title={poll.question}
                onPress={() =>
                  navigation.navigate("PollCard", { poll: poll, group: group })
                }
              />
            ))}
          </View>
        </View>
      </LinearGradient>
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
  body: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    padding: 10,
  },
  serialBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    width: 300,
    alignSelf: "center",
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    marginVertical: 20,
  },
});
