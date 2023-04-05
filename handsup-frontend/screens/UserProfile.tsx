import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getLoginToken, updateUser } from "../services/accountSetup";
import { clearUser } from "../redux/slices/userSlice";
import { setUser } from "../redux/slices/userSlice";
import { RootState, User } from "../redux/types/types";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

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
      <Header navigation={navigation} title="Your Profile" showExit={true} />
      <View style={styles.body}>
  <View style={styles.inputStack}>
    <View style={styles.inputHorizontal}>
      <Text style={[styles.mediumText, styles.label]}>
        Username
      </Text>
      <TextInput
        style={styles.input}
        value={username}
        editable={isEditable}
        onChangeText={setUsername}
      />
    </View>
    <View style={styles.inputHorizontal}>
      <Text style={[styles.mediumText, styles.label]}>
        First Name
      </Text>
      <TextInput
        style={styles.input}
        value={first_name}
        editable={isEditable}
        onChangeText={setfirst_name}
      />
    </View>
    <View style={styles.inputHorizontal}>
      <Text style={[styles.mediumText, styles.label]}>
        Last Name
      </Text>
      <TextInput
        style={styles.input}
        value={last_name}
        editable={isEditable}
        onChangeText={setlast_name}
      />
    </View>
    <View style={styles.inputHorizontal}>
      <Text style={[styles.mediumText, styles.label]}>
        Email
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={isEditable}
        onChangeText={setEmail}
      />
    </View>
    <View style={styles.btn}>
      <Button
        title={isEditable ? "Save" : "Edit"}
        onPress={handleEdit}
        color={"white"}
      />
    </View>
    <View style={styles.btn}>
      <Button
        title="Log out"
        onPress={handleLogout}
        color={"white"}
      />
      </View>
  </View>
</View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141d26",
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputStack: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    width: '30%',
    marginRight: 20,
  },
  mediumText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  btn: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
});