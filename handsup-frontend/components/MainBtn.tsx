import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const MainBtn = ({ title = "Button", onPress = () => null }) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={{ color: "white" }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MainBtn;

const styles = StyleSheet.create({
  btn: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    color: "white",
  },
});
