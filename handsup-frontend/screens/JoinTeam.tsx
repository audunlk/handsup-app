import React, { useState, useEffect } from 'react'
import { listGroupsByKey, insertUserIntoGroup } from '../services/accountSetup'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { checkUserInGroup } from '../services/accountSetup'
import Header from '../components/Header'
import { LinearGradient } from 'expo-linear-gradient'

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
         <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <Header title='Join Team'  showExit={true} navigation={navigation} site={"Groups"}/>
        <View style={styles.body}>
            <TextInput
            id='serialkey'
            placeholder='Enter Team Serial Key'
            autoCapitalize='none'
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
        </LinearGradient>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
      },
    btn: {
        backgroundColor: "#1d9afd",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        width: 150,
      },
    body: {
    marginTop: 20,
      flex: 1,
      color: "white",
      alignItems: "center",
      flexDirection: "column",
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor: "white",
      backgroundColor: "white",
      padding: 10,
      width: 300,
      borderRadius: 5,
    },
    inputText: {
      fontSize: 12,
      color: "white",
    },
})

