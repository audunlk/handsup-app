import React, {useEffect, useState} from 'react'
import { View, Text, TextInput, Button, StyleSheet, InteractionManager, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import BottomNav from '../navigation/BottomNav'
import { useContext } from 'react'
import { UserContext } from '../navigation/ScreenNav'
import { FlatList } from 'react-native-gesture-handler'
import PollCard from '../components/PollCard'


export default function Home({navigation, route }) {
  const { user, setUser } = useContext(UserContext)
  const [polls, setPoll] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  

  

  useEffect(() => {
    console.log(user)
    console.log('user in home')
    // definePolls()
    setIsLoading(false)
  }, []);

  const definePolls = async () => {
    // try {
    //   const polls = await getPollsByUser(user.id)
    //   console.log({polls})
    //   setPoll(polls)
    // } catch (error) {
    //   console.log(error)
    //   setError(error)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  

  return (
    <View style={styles.container}>
        <LinearGradient colors={['#3c41cf', '#1d9afd']} style={styles.linearGradient}>
          <View style={styles.header}>
            <Text>Hi, {user.first_name}!✨</Text>
            <Ionicons name="ios-person" size={24} color="white" 
            onPress={() => navigation.navigate('UserProfile', {user: user})}
            />
          </View>
          <View style={styles.body}>
            <Text style={{color: 'white', fontSize: 20}}>Raise your hand below ✋</Text>
          <View style={styles.listContainer}>
            {/* {isLoading || polls.length === 0 ? (
              <Text style={{color: 'white'}}>No polls yet</Text>
            ) : (
              <FlatList
                data={polls}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Poll', { poll: item })}
                  >
                    <PollCard poll={item} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            )} */}

            </View>            
          </View>

          
        </LinearGradient>
        <BottomNav  navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5
    },
    header: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 80,
        color: 'white',
        flexDirection: 'row',
    },
    body: {
        flex: 1,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        
    },
    listContainer: {
      flex: 1,
      width: '100%',
      marginTop: 20,
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    
    btn: {
      backgroundColor: '#1d9afd',
      padding: 10,
      borderRadius: 10,
      margin: 10,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
    }

})
