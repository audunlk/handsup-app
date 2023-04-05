import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { localToUTC } from '../utils/dateConversion';


export default function DateSelector({ setPoll, poll }) {
  const [selectedDate, setSelectedDate] = useState(new Date());


  const onChange = (event, selectedDate) => {
    setSelectedDate(selectedDate);
    const UTCdate = localToUTC(selectedDate)
    console.log(UTCdate.toISOString())
    setPoll({ ...poll, respond_by: UTCdate});
  };


  return (
    <View>      
        <View>
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display="inline"
            onChange={onChange}
            minimumDate={
              new Date()
            }
          />
        </View>

    </View>
  );
}
