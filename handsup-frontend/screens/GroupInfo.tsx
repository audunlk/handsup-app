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
import { getAllPushTokens } from "../services/userRequests";
import { getMembersById } from "../services/teamRequests";
import ProfilePicture from "../components/ProfilePicture";
import { User, RootState } from "../redux/types/types";
import { useSelector } from "react-redux";
import Loading from "./Loading";

export default function GroupInfo({ navigation, route }) {
  const { team } = route.params;
  const user: User = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    console.log({ team });
    console.log("teams in teams info");
    setIsAdmin(checkAdmin());
    console.log(typeof (team.members))
    if (team.members) {
      getMembers();
    }
    console.log(members)
  }, [team]);


  const getMembers = async () => {
    try {
      setIsLoading(true);
      const members = await getMembersById(team.members);
      setMembers(members);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <Text style={styles.listTitle}>Invitation Key</Text>
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
                  title="Create poll"
                  onPress={() => navigation.navigate("CreatePoll", { team })}
                />
              </View>
            </View>
          )}
          <View style={{marginTop: 20}}>
            <IonIcons name="ios-chatbox-ellipses" size={40} color="white" onPress={redirectToChat}/>
          </View>
        </View>
      </View>

      {isLoading ? (<Loading />) : (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>{members.length} Members</Text>
          {members.map((member) => (
            <View key={member.id} style={styles.listItem}>
              <ProfilePicture id={member.id} size={50} type={"user"} allowPress={false} />
              <Text style={[styles.mediumText, { padding: 10 }]}>{member.firstName}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
