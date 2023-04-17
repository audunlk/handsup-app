import jwtDecode from "jwt-decode";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import ShortUniqueId from "short-unique-id";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import { RootState, User } from "../redux/types/types";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import { createTeam, insertUserIntoTeam } from "../services/firebaseRequests";

export default function JoinTeam({ navigation }) {
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
      await insertUserIntoTeam(id, newGroupSerial, true);
      console.log("inserted user");
    } catch (error) {
      setError(error.message);
    } finally {
      Alert.alert("Team Created", "Your team has been created successfully")
      setSuccessful(true);
      navigation.navigate('Groups')
      setisLoading(false);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
     
        <Header
          navigation={navigation}
          title={"Create Group"}
          showExit={true}
       
        />

        <View style={styles.body}>
          <Text style={styles.mediumText}>Create a Team</Text>
          <TextInput
            placeholder="Enter Team Name"
            value={teamName}
            style={styles.input}
            onChangeText={setTeamName}
          />
          <Pressable
            style={styles.btn}
            onPress={() => handleCreateTeam(teamName)}
          >
            <Text style={styles.smallText}>Create Team</Text>
          </Pressable>
          {error && <Text>{error}</Text>}
        </View>
    </View>
  );
}

