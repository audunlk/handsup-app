import React, { useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { localToUTC } from '../utils/dateConversion';


export default function DateSelector({ UTCdate, setPoll, poll }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  const UTCDate = localToUTC(selectedDate);

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    setSelectedDate(selectedDate);
    setPoll({ ...poll, respond_by: UTCDate.toISOString()});
  };

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  return (
    <View>
      <Button onPress={showDateTimePicker} title="Respond By" />
      {showPicker && (
        <View>
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display="spinner"
            onChange={onChange}
          />
          <Button onPress={hideDateTimePicker} title="Add deadline" />
        </View>
      )}
        

    </View>
  );
}
