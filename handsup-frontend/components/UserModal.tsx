import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import Modal from "react-native-modal";
import styles from "../styles/styles";
import MainBtn from "./MainBtn";

export const UserModal = ({ isVisible, countMap, onClose, selectedAnswer }) => {
    const users = countMap[selectedAnswer] || [];
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.95}>
            <View
                style={[{ alignItems: "center", flex: 1, marginVertical: 100 }]}>
                <View style={{
                    justifyContent: "center",
                    marginBottom: 20,
                }}>
                    <Text style={styles.title}>"{selectedAnswer}"</Text>
                    <Text style={styles.smallText}>Voted by:</Text>
                </View>
                <ScrollView contentContainerStyle={{ alignSelf: "center", height: "100%" }}>
                    {users.map((user) => (
                        <View style={{
                            flexDirection: "column", 
                            width: Dimensions.get("screen").width - 100, 
                            justifyContent: "center", 
                            alignItems: "center", 
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "grey",
                            borderRadius: 10,
                        }} >
                            <Text style={[styles.smallText, { fontWeight: "bold" }]}>{user.username}</Text>
                            <Text style={styles.smallText}>({user.firstName})</Text>
                        </View>
                    ))}
                </ScrollView>
                <View>
                    <MainBtn title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};
