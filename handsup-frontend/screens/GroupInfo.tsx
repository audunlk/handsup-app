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
import { getPollsByTeamSerial } from "../services/firebaseRequests";
import ProfilePicture from "../components/ProfilePicture";
import { handlePickAvatar } from "../utils/handlePickAvatar";
import { User, RootState } from "../redux/types/types";
import { useSelector } from "react-redux";

export default function GroupInfo({ navigation, route }) {
  const { team } = route.params;
  const user: User = useSelector((state: RootState) => state.user);
  const [polls, setPolls] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    console.log({ team });
    console.log("teams in teams info");
    setIsAdmin(checkAdmin());
    getPolls();
  }, [team]);

  const checkAdmin = () => {
    console.log(team.members)
    const isAdmin = team.members.find((member) => member.id === user.id).admin;
    console.log(isAdmin)
    return isAdmin
  };

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(team.serialKey);
    Alert.alert(`Copied to clipboard`);
  };

  const getPolls = async () => {
    try {
      const polls = await getPollsByTeamSerial(team.serialKey);
      console.log(team.serialKey)
      setPolls(polls);
      console.log({ polls })
    } catch (error) {
      console.log(error);
    }
  };

  const redirectToChat = () => {
    navigation.navigate("Chat", { team, teamSerial: team.serialKey, name: team.name });
  };

  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <View style={styles.body}>
        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
          <ProfilePicture id={team.serialKey} size={200} type={"team"} allowPress={isAdmin}
          />
          {isAdmin && (
            <View>
              <Text style={styles.listTitle}>Invitation Key</Text>
              <IonIcons name="key-outline" size={24} color="white" />
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
          <IonIcons name="chatbox-ellipses-outline" size={24} color="white" />
          <MainBtn title="Chat" onPress={redirectToChat} />
        </View>
      </View>

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

    </ScrollView>
  );
}
