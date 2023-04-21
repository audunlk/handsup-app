import React, { useState, useEffect } from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { localToUTC } from "../utils/dateConversion";

export default function DateSelector({ setPoll, poll }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    setSelectedDate(selectedDate);
    const UTCdate = localToUTC(selectedDate);
    console.log(UTCdate.toISOString() + " UTC DateSelector");
    setPoll({ ...poll, respond_by: UTCdate });
  };

  return (
    <View>
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display="inline"
          style={{ width: 300, height: 400, justifyContent: "center", alignSelf: "center" }}
          onChange={onChange}
          minimumDate={new Date()}
        />
    </View>
  );
}
