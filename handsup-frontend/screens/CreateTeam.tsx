import jwtDecode from "jwt-decode";
import React, { useState, useEffect, useContext } from "react";
import {
  listGroupsByKey,
  updateUser,
  createGroup,
} from "../services/accountSetup";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import ShortUniqueId from "short-unique-id";
import { UserContext } from "../navigation/ScreenNav";
import { insertUserIntoGroup } from "../services/accountSetup";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";

export default function JoinTeam({ navigation }) {
  const [teamName, setTeamName] = useState("");
  const [successful, setSuccessful] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [isLoading, setisLoading] = useState(false);

  interface CurrentUser {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    admin: boolean;
    group_id: number;
  }

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
      const newGroup = await createGroup(name, serialkey);
      const { id } = user;
      const insertUser = await insertUserIntoGroup(id, newGroup.id, true);
      if (!insertUser) {
        setError("Error creating team");
        return;
      }
      console.log("inserted user");
    } catch (error) {
      setError(error.message);
    } finally {
      setSuccessful(true);
      setisLoading(false);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <Header
          navigation={navigation}
          title={"Create Group"}
          showExit={true}
        />

        <View style={styles.body}>
          <Text>Create a Team</Text>
          <TextInput
            placeholder="Enter Team Name"
            value={teamName}
            onChangeText={setTeamName}
          />
          <Pressable
            style={styles.btn}
            onPress={() => handleCreateTeam(teamName)}
          >
            <Text style={styles.inputText}>Create Team</Text>
          </Pressable>
          {error && <Text>{error}</Text>}
          {successful && (
            <Pressable
              style={styles.btn}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.inputText}>Go to Home</Text>
            </Pressable>
          )}
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
  btn: {
    backgroundColor: "#1d9afd",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    width: 150,
  },
  body: {
    marginTop: 20,
    flex: 1,
    color: "white",
    alignItems: "center",
    flexDirection: "column",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    padding: 10,
    width: 300,
    borderRadius: 5,
  },
  inputText: {
    fontSize: 12,
    color: "white",
  },
});
