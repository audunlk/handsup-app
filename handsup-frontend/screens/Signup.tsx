import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { createUser, getLoginToken } from "../services/accountSetup";
import { CheckBox } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setState] = useState(true);
  const [loginValidTill, setLoginValidTill] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  
  useEffect(() => {
    AsyncStorage.clear()
    console.log('in signup page')
    const getToken = async () => {
      const token = await AsyncStorage.getItem("handsup-token");
      if (token) {
        navigation.navigate("Home");
      }
      console.log('no token')
      return
        };
        console.log('notoken')
    getToken();
  }, [navigation]);

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }
    ).start();
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await createUser(
        email,
        password,
        first_name,
        last_name,
        username,
      );
      console.log(user)
      console.log("user")
      const { token, error } = await getLoginToken(email, password).then(
        (response) => {
          console.log(response);
          return response;
        }
      )
      if(error) {
        setError(error)
      }
      if(token) {
      await AsyncStorage.setItem("handsup-token", token)
      navigation.navigate("Home");
      }

    } catch (error) {
      console.log("error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  const handleCheckbox = (boolean: boolean) => {
    // if checked, set loginValidTill to 1000 * 60 * 60 * 24 * 30 and change fill color of checkbox
    const currentTimestamp = new Date().getTime();
    setState(!checked)
    if (boolean) {
      setLoginValidTill(currentTimestamp + 1000 * 60 * 60 * 24 * 30);
    } else {
      setLoginValidTill(currentTimestamp + 1000 * 60 * 60 * 24);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>Create a profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={first_name}
        onChangeText={setfirst_name}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={last_name}
        onChangeText={setlast_name}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <CheckBox
        checked={checked}
        onPress={() => handleCheckbox(checked)}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        style={styles.keepLogged}
        title="Keep me logged in"
        iconRight={true}
        containerStyle={{
          backgroundColor: "#3C41CF",
          borderColor: "#3C41CF",
          padding: 10,
          margin: 10,
          borderRadius: 5,
        }}
        checkedColor="white"
        uncheckedColor="white"
        textStyle={{ color: "white" }}
      />
      <View style={styles.button}>
        <Button
          title="Signup"
          onPress={handleSignup}
          disabled={loading}
          color="white"
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={styles.footerText}>
          Already have an account?
          <Text
            onPress={() => navigation.navigate("Login")}
            style={{ color: "black" }}
          >
            Login
          </Text>
        </Text>
      </View>
      {error && <Text>{error}</Text>}
    </Animated.View>
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
    backgroundColor: '#3C41CF',
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
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
  button: {
    alignItems: "center",
    backgroundColor: 'black',
    padding: 10,
    border: 1,
    borderRadius: 30,
    width: 300,
    borderColor: "black",
    color: "white",
    ...shadow,
  },
  text: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 30,
  },
  
  keepLogged: {
    backgroundColor: '#3C41CF',
    color: 'white',
    
  },
    footerText: {
    color: "white",
    fontSize: 15,
    marginTop: 20,
    },
    
});
