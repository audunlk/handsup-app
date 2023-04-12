import React from "react";
import { View, Text, StyleSheet } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

export default function BottomNav({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IonIcons
          name="home"
          size={24}
          color="white"
          onPress={() => navigation.navigate("Home")}
        />
        <Text style={{ color: "white", fontSize: 12 }}>Home</Text>
      </View>

      <View style={styles.iconContainer}>
        <IonIcons
          name="ios-people"
          size={24}
          color="white"
          onPress={() => navigation.navigate("Groups")}
        />
        <Text style={{ color: "white", fontSize: 12 }}>Teams</Text>
      </View>
      <View style={styles.iconContainer}>
        <IonIcons name="ios-podium" size={24} color="white" />
        <Text style={{ color: "white", fontSize: 12 }}>Polls</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#141d26",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
