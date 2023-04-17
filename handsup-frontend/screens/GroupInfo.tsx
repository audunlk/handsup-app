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
import MainBtn from "../components/MainBtn";
import styles from "../styles/styles";

export default function GroupInfo({ navigation, route }) {
  const { team } = route.params;
  const [polls, setPolls] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log({team});
    console.log("teams in teams info");
    setIsAdmin(checkAdmin());
  }, []);

  const checkAdmin = () => {
    const isAdmin = team.members.find((member) => member.admin === true);
    if(isAdmin) {
      return true;
    }
    return false;
  };
    

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(team.serialKey);
    Alert.alert(`Copied to clipboard`);
  };

  // const listPollsInteams = async () => {
  //   const listPolls = await getPollsByTeams(teams.id);
  //   console.log({ listPolls });
  //   setPolls(listPolls);
  // };

  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <View style={styles.body}>
        {isAdmin && (
          <View>
            <Text style={styles.smallText}>
              {isAdmin ? "Leader" : "Member"}
            </Text>
            <Text style={styles.listTitle}>Invitation Key:</Text>
            <TouchableOpacity
              style={styles.serialBox}
              onPress={copyToClipboard}
            >
              <TextInput
                value={team.serialKey}
                caretHidden={true}
                autoCorrect={false}
                editable={false}
              />
              <IonIcons name="copy-outline" size={24} color="black" />
            </TouchableOpacity>
            <View>
              <MainBtn
                title="Create a Poll"
                onPress={() => navigation.navigate("CreatePoll", { team })}
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
                  navigation.navigate("PollCard", { poll: poll, team })
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
