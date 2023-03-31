import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getLoginToken, updateUser } from "../services/accountSetup";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../navigation/ScreenNav";
import { clearUser } from "../redux/slices/userSlice";
import { setUser } from "../redux/slices/userSlice";
import { setToken } from "../redux/slices/tokenSlice";
import { RootState, User } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";




export default function UserProfile({ navigation }) {
  const user = useSelector((state: RootState) => state.user);

  console.log(` user in UserProfile:`);
  console.log({user})
  const dispatch = useDispatch();
  const [isEditable, setIsEditable] = useState(false);
  const [username, setUsername] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [password, setPassword] = useState(user.password);
  const [email, setEmail] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const resetInfo = async () => {
    setUsername(user.username);
    setfirst_name(user.first_name);
    setlast_name(user.last_name);
    setEmail(user.email);
    setIsLoading(false)
  };

  useEffect(() => {
    setIsLoading(true)
    resetInfo();
  }, []);

  const handleEdit = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      handleUpdateUser();
    }
  };

  const handleUpdateUser = async () => {
    setIsEditing(true);
    Alert.alert("Are you sure?", "You are about to update your profile.", [
      {
        text: "Cancel",
        onPress: () => {setIsEditing(false), resetInfo()},
        style: "cancel",
      },
      {
        text: "Update",
        onPress: async () => {
          const updatedUser = await updateUser(
            user.id,
            email,
            first_name,
            last_name,
            username
          );
          const newToken = await getLoginToken(email, password);
          dispatch(setToken(newToken));
          dispatch(setUser(updatedUser));
        },
      },
    ]);

  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    Alert.alert(
      "Are you sure?",
      "Logging out will clear your session and you will need to log in again.",
      [
        {
          text: "Cancel",
          onPress: () => setIsLoggingOut(false),
          style: "cancel",
        },
        {
          text: "Log out",
          onPress: async () => {
            clearUser();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          {/* X icon */}
          <Ionicons
            name="close"
            size={30}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.inputText}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            editable={isEditable}
            onChangeText={setUsername}
          />
          <Text style={styles.inputText}>First Name</Text>
          <TextInput
            style={styles.input}
            value={first_name}
            editable={isEditable}
            onChangeText={setfirst_name}
          />
          <Text style={styles.inputText}>Last Name</Text>

          <TextInput
            style={styles.input}
            value={last_name}
            editable={isEditable}
            onChangeText={setlast_name}
          />
          <Text style={styles.inputText}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            editable={isEditable}
            onChangeText={setEmail}
          />
          <View style={styles.btn}>
            <Button
              title={isEditable ? "Save" : "Edit"}
              onPress={handleEdit}
              color={"white"}
            />
          </View>
          <View
            style={[
              styles.btn,
              {
                position: "absolute",
                bottom: 40,
                backgroundColor: "black",
                borderRadius: 10,
              },
            ]}
          >
            <Button
              title="Log out"
              onPress={handleLogout}
              disabled={isLoggingOut}
              color={"white"}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const shadow = {
  shadowColor: "black",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.26,
  shadowRadius: 6,
  elevation: 5,
};

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
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginVertical: 20,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 80,
    color: "white",
    flexDirection: "row",
  },
  body: {
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
    ...shadow,
  },
  inputText: {
    fontSize: 12,
    color: "white",
  },

  btn: {
    backgroundColor: "#1d9afd",
    padding: 10,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});
