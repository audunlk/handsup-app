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
import { deleteTeam, getMembersById, leaveGroup, makeAdmin } from "../services/teamRequests";
import ProfilePicture from "../components/ProfilePicture";
import { User, RootState } from "../redux/types/types";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { triggerReRender } from "../redux/slices/reRenderSlice";
import { useDispatch } from "react-redux";

export default function GroupInfo({ navigation, route }) {
  const { team } = route.params;
  const user: User = useSelector((state: RootState) => state.user);
  const reRender = useSelector((state: RootState) => state.reRender);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    setIsAdmin(checkAdmin());
    if (team.members) {
      getMembers();
    }
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

  const checkMemberAuth = (memberId: string) => {
    const isAdmin = team.members.find((member) => memberId === member.id).admin;
    return isAdmin 
  };

  const handleDeleteTeam = async () => {
    Alert.alert(
      "Delete team",
      "Are you sure you want to delete this team?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete", onPress: async () => {
            try {
              const response = await deleteTeam(team.serialKey);
              dispatch(triggerReRender(!reRender))
              navigation.navigate("Groups");
            } catch (error) {
              console.log(error);
            }
          }
        },
      ],
      { cancelable: false }
    );
  };

  const copyToClipboard = async () => {
    Clipboard.setStringAsync(team.serialKey);
    Alert.alert(`Copied to clipboard`);
  };

  const redirectToChat = () => {
    navigation.navigate("Chat", { team, teamSerial: team.serialKey, name: team.name });
  };

  const handleLeaveTeam = async () => {
    Alert.alert(
      "Leave team",
      "Are you sure you want to leave this team?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Leave",
          onPress: async () => {
            try {
              await handleRemoveUser(user.id, team.serialKey);
              navigation.navigate("Groups");
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRemoveUser = async (userId, serialKey) => {
    try {
      const response = await leaveGroup(userId, serialKey);
      dispatch(triggerReRender(!reRender))
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleMakeAdmin = async (userId, serialKey) => {
    try {
      const response = await makeAdmin(userId, serialKey);
      dispatch(triggerReRender(!reRender))
    }
    catch (error) {
      console.log(error)
    }
  }



  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} title={team.name} showExit={true} />
      <View style={styles.body}>
        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
          <ProfilePicture id={team.serialKey} size={200} type={"team"} allowPress={isAdmin}
          />
          {isAdmin && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={[styles.listTitle, { paddingTop: 20 }]}>Invitation Key</Text>
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
                <MainBtn
                  title="Delete team"
                  onPress={() => handleDeleteTeam()}
                />
              </View>
              <MainBtn title="Leave team" onPress={() => handleLeaveTeam()} />

            </View>
          )}
          <View style={{ marginTop: 20 }}>
            <IonIcons name="ios-chatbox-ellipses" size={40} color="white" onPress={redirectToChat} />
          </View>
        </View>
      </View>

      {isLoading ? (<Loading />) : (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>{members.length} Members</Text>
          {members.map((member) => (
            <>
              {member.id !== user.id && (
                <View key={member.id} style={[styles.listItem]}>
                  <ProfilePicture id={member.id} size={50} type={"user"} allowPress={false} />
                  <Text style={[styles.mediumText, { padding: 10 }]} numberOfLines={1} ellipsizeMode="tail">{member.firstName}</Text>
                  {isAdmin && !checkMemberAuth(member.id) && 
                  <TouchableOpacity
                    onPress={() => handleMakeAdmin(member.id, team.serialKey)}
                  >
                    <Text style={styles.smallText}>Make Owner</Text>
                  </TouchableOpacity>
                  }
                  {/* {isAdmin && !member.admin && 
                  <TouchableOpacity
                    onPress={() => handleRemoveUser(member.id, team.serialKey)}
                  >
                    <Text style={styles.smallText}>Remove Member</Text>
                  </TouchableOpacity>
                  } */}
                </View>
              )}
            </>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
