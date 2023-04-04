import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Header from "../components/Header";
import { Ionicons as IonIcons } from "@expo/vector-icons";
import { getPollsByGroup } from "../services/pollSetup";
import MainBtn from "../components/MainBtn";
import styles from "../styles/styles";

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
    <ScrollView style={styles.container}>
      <Header navigation={navigation} title={group.name} showExit={true} />
      <View style={styles.body}>
        {group.is_admin && (
          <View>
            <Text style={styles.smallText}>
              {group.is_admin ? "Leader" : "Member"}
            </Text>
            <Text style={styles.listTitle}>Invitation Key:</Text>
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
                title="Create a Poll"
                onPress={() => navigation.navigate("CreatePoll", { group })}
              />
            </View>
          </View>
        )}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Active Polls</Text>
          {polls.map((poll, i) => (
            <View style={styles.listItem} key={i}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PollCard", { poll: poll, group: group })
                }
              >
                <Text style={styles.mediumText}>{poll.question}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
