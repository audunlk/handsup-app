import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import { ISOtoReadable } from "./dateConversion";

export const renderPolls = (polls: any, navigation: any, teams: any) => {
  const today = new Date().setHours(0, 0, 0, 0);

  return polls.map((poll, i) => {
    

    const [readableDate, readableTime] = ISOtoReadable(poll.respond_by);
    const respondByDate = new Date(poll.respond_by).setHours(0, 0, 0, 0);

    const respondByText = respondByDate === today ? readableTime : readableDate;
    const isExpired = respondByDate < today ? "Expired" : "Expires";
    return (
      <View style={styles.listItem} key={poll.id}>
        <TouchableOpacity
          key={i}
          onPress={() => navigation.navigate("PollCard", { poll: poll, team: teams.find((team:any) =>team.serialKey === poll.teamSerial)})}
        >
          <Text style={[styles.listDescription, {color: "#FFA500"}]}>{poll.teamName}</Text>
          <Text style={styles.listTitle}>{poll.question}</Text>
          <Text style={styles.listDescription}>
            {isExpired}: {respondByText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });
};
