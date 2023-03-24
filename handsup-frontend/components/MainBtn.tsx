import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const MainBtn = ({title = 'Button', onPress = () => null}) => {
    return (
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  };

export default MainBtn;


  const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#1d9afd",
        padding: 10,
        borderRadius: 10,
        width: 300,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 10,
      },
    });

