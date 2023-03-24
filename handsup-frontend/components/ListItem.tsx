import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ListItem = ({ title = "ListItem", onPress = () => null }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  item: {
    height: 40,
    margin: 12,
    backgroundColor: "#1d9afd",
    padding: 10,
    width: 300,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
export default ListItem;
