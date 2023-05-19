import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import ProfilePicture from "../components/ProfilePicture";
import LottieView from 'lottie-react-native';

const emptyTeams = () => {
    return (
        <View style={{justifyContent: "center", alignItems: "center"}}>
            <LottieView
                source={require("../assets/animations/empty.json")}
                autoPlay
                loop
                style={{
                    width: 300,
                    height: 300,
                }}
            />
            <Text style={[styles.mediumText, { color: "#FFA500", marginBottom: 5}]}>Join or Create a team to get started!</Text>
            <Text style={[styles.smallText]}>Your teams will appear here.</Text>
        </View>
    )
}

const renderTeams = (teams, navigation) => {
    return (
        <View style={styles.listContainer}>
            {teams.map((team, i) => {
                return(
                    <View style={styles.listItem} key={i}>
                    <ProfilePicture id={team.serialKey} size={50} type={"team"} allowPress={false} />
                    <TouchableOpacity
                        key={team.id}
                        onPress={() => navigation.navigate("GroupInfo", { team })}
                    >
                        <Text style={[styles.mediumText, { marginLeft: 10 }]}>{team.name}</Text>
                    </TouchableOpacity>
                </View>
                )
            })}
        </View>
    )
};


export const handleRenderTeams = (teams, navigation) => {
    if (teams.length === 0) {
        return emptyTeams();
    } else {
        return renderTeams(teams, navigation);
    }
};