import React, {useState} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import { ISOtoReadable } from "./dateConversion";
import date from 'date-and-time';



export const renderPolls = (polls: any, navigation: any, teams: any) => {
  const today = new Date()
  return polls.map((poll, i) => {
    const pollDate = new Date(poll.respond_by);

    const pattern = date.compile('ddd, MMM DD YYYY, HH:mm');
    
    const respondByDate = date.format(pollDate, pattern);
    const expiredOrNot = pollDate > today ? true : false

    return (
      <View style={styles.listItem} key={poll.id}>
        <TouchableOpacity
          key={i}
          onPress={() => navigation.navigate("PollCard", { poll: poll, team: teams.find((team:any) =>team.serialKey === poll.teamSerial)})}
        >
          <Text style={[styles.listDescription, {color: "#FFA500"}]}>{poll.teamName}</Text>
          <Text style={[styles.mediumText, {marginLeft: 10}]}>{poll.question}</Text>
          <Text style={styles.listDescription}>
            {expiredOrNot ? `Respond by: ${respondByDate}` : `Expired: ${respondByDate}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });
};
