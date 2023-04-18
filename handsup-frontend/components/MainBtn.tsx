import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import styles from "../styles/styles";
const MainBtn = ({ title = "Button", onPress = () => null }) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={{ color: "white" }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MainBtn;


