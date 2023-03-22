import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
    },
    title: {
      fontSize: 30,
      color: "white",
      fontWeight: "bold",
      marginVertical: 20,
    },
    header: {
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 80,
      color: "white",
      flexDirection: "row",
    },
    body: {
      flex: 1,
      color: "white",
      alignItems: "center",
      flexDirection: "column",
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
    inputText: {
      fontSize: 12,
      color: "white",
    },
  
    btn: {
      backgroundColor: "#1d9afd",
      padding: 10,
      borderRadius: 10,
      width: 200,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
  });