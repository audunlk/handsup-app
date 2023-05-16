import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import styles from '../styles/styles'

export default function Loading() {
  return (
    <View style={[styles.container]}>
      <View style={styles.body}>
        <ActivityIndicator
        
        size="large"
        color="white"
         />
      </View>
    </View>)
}
