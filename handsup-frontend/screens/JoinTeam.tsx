import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import Header from '../components/Header'
import styles from '../styles/styles'
import { checkUserInTeam, getTeamBySerialKey, insertUserIntoTeam } from '../services/firebaseRequests'

export default function JoinTeam({route, navigation}) {
    const [serialkey, setSerialkey] = useState('')
    const [successful, setSuccessful] = useState(false)
    const [user, setUser] = useState(route.params.user)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(user)
        console.log('user in join team')
        if(successful){
            console.log('successful')
        }
    }, [successful])
    

    const handleJoinTeam = async (serialkey: string) => {
        setError('')
        // const isKeyValid = await checkKey(serialkey)        
        try{
            const alreadyMember = await checkUserInTeam(user.id, serialkey)
        console.log(alreadyMember)
        if(!alreadyMember) {
            try {
                const insertUser = await insertUserIntoTeam(user.id, serialkey, false)
                console.log(insertUser)
                Alert.alert('Team Joined', 'You have successfully joined the team')
                navigation.navigate('Groups')
            } catch (error) {
                setError(error.message)
            }
        } else {
            setError('Already a member of this team')
            return
        }
        }catch(error) {
            setError(error.message)
        }finally {
            setLoading(false)
        }

    }


  return (
    <View style={styles.container}>
         
        <Header title='Join Team'  showExit={true} navigation={navigation}/>
        <View style={styles.body}>
            <Text style={styles.mediumText}>Join Team</Text>
            <TextInput
            id='serialkey'
            placeholder='Enter Team Serial Key'
            autoCapitalize='none'
            style={styles.input}
            value={serialkey} onChangeText={setSerialkey}
             />
            <Pressable 
            style={styles.btn}
            onPress={() => handleJoinTeam(serialkey)} >
                <Text style={{color: "white"}}>Join Team</Text>
            </Pressable>
            {successful &&
            <Pressable onPress={() => navigation.navigate("Home")}>
                <Text style={{color: "white"}}>Go to Home</Text>
            </Pressable>
            }
            {error && <Text>{error}</Text>}
        </View>

    </View>
  )
}


