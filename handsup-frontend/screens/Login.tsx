import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Animated, Easing } from "react-native";
import { getLoginToken } from "../services/accountSetup";

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log('in login page')
    const getToken = async () => {
      const token = await AsyncStorage.getItem("handsup-token");
      if (token) {
        navigation.navigate("Home");
      }
      return
    };
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


  const handleLogin = async () => {
    setLoading(true);
    setError("");
    console.log("email", email);
    console.log("password", password);
    try {
      const { token, error } = await getLoginToken(email, password).then((res) => {
        console.log(res);
        return res;
      });
      if (error) {
        setError(error);
      }
      if (!token) {
        setError("Invalid credentials");
      }
      await AsyncStorage.setItem("handsup-token", token);
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.text}>Login</Text>
      <TextInput 
      style={styles.input}
      placeholder="Email" value={email} onChangeText={setEmail} 
      autoCapitalize="none"
      autoComplete="email"
      />
      <TextInput
      style={styles.input}      
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <View
        style={styles.button}
      >
        <Button title="Login" onPress={handleLogin}
        color="white"
         />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={styles.footerText}>
          Don't have an account?
          <Text
            onPress={() => navigation.navigate("Signup")}
            style={{ color: "black" }}
          >
            Sign Up
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
