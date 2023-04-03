import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getLoginToken, updateUser } from "../services/accountSetup";
import { Ionicons } from "@expo/vector-icons";
import { clearUser } from "../redux/slices/userSlice";
import { setUser } from "../redux/slices/userSlice";
import { setToken } from "../redux/slices/tokenSlice";
import { RootState, User } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIsLoggedIn } from "../redux/slices/loggedInSlice";
import styles from "../styles/styles";

export default function UserProfile({ navigation }) {
  const user = useSelector((state: RootState) => state.user);

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
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
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
        onPress: () => {
          setIsEditing(false), resetInfo();
        },
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
          AsyncStorage.setItem("handsup-token", newToken.token);
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
            AsyncStorage.clear();
            dispatch(clearUser());
            navigation.navigate("Login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.listContainer}>
        <Text style={[styles.mediumText, { alignSelf: "flex-start", marginLeft: '10%' }]}>
          Username
        </Text>
        <TextInput
          style={styles.input}
          value={username}
          editable={isEditable}
          onChangeText={setUsername}
        />
        <Text style={[styles.mediumText, { alignSelf: "flex-start", marginLeft: '10%' }]}>
          First Name
        </Text>
        <TextInput
          style={styles.input}
          value={first_name}
          editable={isEditable}
          onChangeText={setfirst_name}
        />
        <Text style={[styles.mediumText, { alignSelf: "flex-start", marginLeft: '10%' }]}>
          Last Name
        </Text>

        <TextInput
          style={styles.input}
          value={last_name}
          editable={isEditable}
          onChangeText={setlast_name}
        />
        <Text style={[styles.mediumText, { alignSelf: "flex-start", marginLeft: '10%' }]}>
          Email
        </Text>
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
    </View>
  );
}
