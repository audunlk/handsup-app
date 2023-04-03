import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { getLoginToken } from "../services/accountSetup";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../redux/slices/loadingSlice";
import { RootState } from "../redux/types/types";
import { setIsLoggedIn } from "../redux/slices/loggedInSlice";


export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state: RootState) => state.user);
  


  const handleLogin = async () => {
    try {
      dispatch(setIsLoading(true));
      const { token, error } = await getLoginToken(email, password);
      if (error) {
        setError(error);
        return;
      }
      await AsyncStorage.setItem("handsup-token", token);
      dispatch(setIsLoggedIn(true)); // Dispatch action to set isLoggedIn to true
    } catch (err) {
      setError(err.message);
    }finally{
      dispatch(setIsLoading(false));
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <View style={styles.button}>
        <Button title="Login" onPress={handleLogin} color="white" />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={styles.footerText}>
          Don't have an account?
          <Text onPress={() => navigation.navigate("Signup")} style={{ color: "black" }}>
            Sign Up
          </Text>
        </Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
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
  backgroundColor: '#3C41CF',
  alignItems: "center",
  justifyContent: "center",
  padding: 80,
},
error:{
  color: "red",
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 20,

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
