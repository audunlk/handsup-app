import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import ShortUniqueId from "short-unique-id";
import { RootState, User } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import Modal from "react-native-modal";
import { triggerReRender } from "../redux/slices/reRenderSlice";
import { createGroupChat, createTeam, insertUserIntoTeam } from "../services/firebaseRequests";

export default function JoinTeam({ navigation, isVisible, setIsVisible }) {
  const dispatch = useDispatch();
  const reRender = useSelector((state: RootState) => state.reRender);
  const [teamName, setTeamName] = useState("");
  const [successful, setSuccessful] = useState(false);
  const user: User = useSelector((state: RootState) => state.user);
  const [error, setError] = useState("");
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (successful) {
      setError("Successful");
      console.log("successful");
    }
  }, [successful, navigation]);

  const handleCreateTeam = async (name: string) => {
    setisLoading(true);
    setError("");
    try {
      const serialkey = new ShortUniqueId().randomUUID(6);
      const newGroupSerial = await createTeam(name, serialkey);
      const { id } = user;
      await createGroupChat(newGroupSerial, id);
      await insertUserIntoTeam(id, newGroupSerial, true);
      console.log("inserted user");
    } catch (error) {
      setError(error.message);
    } finally {
      setSuccessful(true);
      dispatch(triggerReRender(!reRender));
      setisLoading(false);
      setIsVisible(null);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Modal
    isVisible={isVisible}
    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
    animationIn={'slideInUp'}
    animationOut={'slideOutDown'}
    onBackdropPress={() => setIsVisible(null)}
    >
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
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setIsVisible(null)}
          >
            <Text style={styles.smallText}>Back</Text>
          </TouchableOpacity>
          {error && <Text>{error}</Text>}
        
    </Modal>
  );
}

