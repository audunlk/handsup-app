import React, { useState, useEffect } from 'react'
import { listGroupsByKey, insertUserIntoGroup } from '../services/accountSetup'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { checkUserInGroup } from '../services/accountSetup'
import Header from '../components/Header'
import styles from '../styles/styles'

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

    async function checkKey(key: string) {
        const isKeyValid = await listGroupsByKey(key)
        console.log(isKeyValid) 
        if(!isKeyValid) {
            console.log('invalid key')
            setError('Invalid Team Key')
            setSerialkey('')
            setLoading(false)
            return
        }
        return isKeyValid
    }
    async function checkInput(key: string) {
        if(key.length < 6 || key.length > 6 || key === '') {
            console.log('invalid key length')
            setError('Invalid Team Key')
            setSerialkey('')
            setLoading(false)
            return false
        }
        return true
    }

    const handleJoinTeam = async (serialkey: string) => {
        setLoading(true)
        setError('')
        const validInput = await checkInput(serialkey)
        if(!validInput) return
        const isKeyValid = await checkKey(serialkey)        
        const alreadyMember = await checkUserInGroup(user.id, isKeyValid.id)
        console.log(alreadyMember)
        if(alreadyMember.length === 0) {
            console.log('not a member')
            try {
                const insertUser = await insertUserIntoGroup(user.id, isKeyValid.id, false)
                console.log(insertUser)
                setError('Team Joined')
            } catch (error) {
                console.log('failed')
                console.log(error)
            }finally   {
                console.log('Becomes a member')
                setSuccessful(true)
                setLoading(false)
            }
        } else {
            setError('Already a member of this team')
            setLoading(false)
            return
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


