import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import ShortUniqueId from "short-unique-id";
import { RootState, User } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import { triggerReRender } from "../redux/slices/reRenderSlice";
import { createTeam, insertUserIntoTeam } from "../services/teamRequests";
import { createGroupChat } from "../services/chatRequests";
import Loading from "./Loading";

export default function CreateTeam({ isVisible, setIsVisible }) {
  const dispatch = useDispatch();
  const reRender = useSelector((state: RootState) => state.reRender);
  const [teamName, setTeamName] = useState("");
  const [successful, setSuccessful] = useState(false);
  const user: User = useSelector((state: RootState) => state.user);
  const [error, setError] = useState("");
  const [isLoading, setisLoading] = useState(false);

  

  const handleCreateTeam = async (name: string) => {
    setError("");
    try {
      const serialkey = new ShortUniqueId().randomUUID(6);
      const newGroupSerial = await createTeam(name, serialkey);
      const { id } = user;
      await createGroupChat(newGroupSerial, id);
      await insertUserIntoTeam(id, newGroupSerial, true);
      console.log("inserted user");
      setIsVisible(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setSuccessful(true);
      dispatch(triggerReRender(!reRender));
    }
  };


  return (
    <Modal
      isVisible={isVisible}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      animationIn={'zoomIn'}
      backdropOpacity={0.9}
      animationInTiming={500}
      hideModalContentWhileAnimating={true}
      onBackdropPress={() => setIsVisible(null)}
    >
      <Text style={styles.title}>Create Team</Text>
      <TextInput
        placeholder="Enter Team Name"
        value={teamName}
        style={styles.input}
        placeholderTextColor={"grey"}
        onChangeText={setTeamName}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleCreateTeam(teamName)}
      >
        <Text style={styles.smallText}>Create Team</Text>
      </TouchableOpacity>
      {error && <Text>{error}</Text>}
    </Modal>
  );
}

