import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Alert, KeyboardAvoidingView } from "react-native";
import { clearUser } from "../redux/slices/userSlice";
import { setUser } from "../redux/slices/userSlice";
import { RootState, User } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import { updateUser } from "../services/userRequests";
import ProfilePicture from "../components/ProfilePicture";
import { checkValidity } from "../utils/regex";
import styles from "../styles/styles";
import MainBtn from "../components/MainBtn";
import { getPermission } from "../services/getPushPermission";

export default function UserProfile({ navigation }) {
  const user: User = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const [isEditable, setIsEditable] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const resetInfo = async () => {
    setUsername(user.username);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    resetInfo();
    console.log({ user })
  }, [user]);

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
          try {
            const isValid = checkValidity(firstName, lastName, username);
            if (isValid) {
              const updatedUserData = {
                ...user,
                username,
                firstName,
                lastName,
              };
              const updatedUser = await updateUser(user.id, updatedUserData);
              dispatch(setUser(updatedUser));
            }
          } catch (error) {
            setError(error.message);
          }
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
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}>
      <Header navigation={navigation} title="Your Profile" showExit={true} />
      <View style={styles.body}>
        <ProfilePicture id={user.id} size={180} type={"user"} allowPress={true} />
        <Text style={[styles.smallText, { marginBottom: 10 }]}>Tap to upload</Text>
        <Text style={[styles.smallText]}>
          Username
        </Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={username}
          editable={isEditable}
          onChangeText={setUsername}
          onChange={() => setError("")}
        />
        <Text style={[styles.smallText]}>
          First Name
        </Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={firstName}
          editable={isEditable}
          onChangeText={setFirstName}
          onChange={() => setError("")}
        />
        <Text style={[styles.smallText]}>
          Last Name
        </Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={lastName}
          editable={isEditable}
          onChangeText={setLastName}
          onChange={() => setError("")}
        />
        <Text style={[styles.smallText, { textAlign: "center" }]}>{error}</Text>
        <MainBtn title={isEditable ? "Save" : "Edit"} onPress={handleEdit} />
        <MainBtn title="Log out" onPress={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
}

