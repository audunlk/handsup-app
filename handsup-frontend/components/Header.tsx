import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'



export default function Header({navigation, title, showExit }) {
    const showExitButton = showExit ? true : false;

  return (
    <View style={styles.header} >
          <Text style={styles.title}>{title}</Text>
            {showExitButton && (
          <Ionicons
            name="close"
            size={30}
            color="white"
            onPress={() => navigation.goBack()}
          />
            )}
    </View>
    )   
}


const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      color: "white",
      fontWeight: "bold",
    },
    header: {
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 80,
      color: "white",
      flexDirection: "row",
    },
  });





