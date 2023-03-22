import React from 'react'
import { View, Text } from 'react-native'

{/* <PollCard poll={item} /> */}

export default function PollCard( {poll} ) {
  return (
    <View>
        <Text>{poll.title}</Text>
    </View>
  )
}
 