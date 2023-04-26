import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import styles from '../styles/styles'
import { checkUserInTeam, insertUserIntoTeam } from '../services/firebaseRequests'
import Loading from './Loading'
import { setIsLoading } from '../redux/slices/loadingSlice'
import Modal from 'react-native-modal'
import { RootState, User } from '../redux/types/types'
import { useSelector } from 'react-redux'

export default function JoinTeam({navigation, isVisible, setIsVisible}) {
    const user: User = useSelector((state: RootState) => state.user)
    const [serialkey, setSerialkey] = useState('')
    const [successful, setSuccessful] = useState(false)
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
        setIsLoading(true)      
        try{
            const alreadyMember = await checkUserInTeam(user.id, serialkey)
            console.log(alreadyMember)
        if(!alreadyMember) {
            try {
                const insertUser = await insertUserIntoTeam(user.id, serialkey, false)
                console.log(insertUser)
                Alert.alert('Team Joined', 'You have successfully joined the team')
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
            setIsVisible(null)
        }
    }

    if(loading) return <Loading />


  return (
    <Modal
    isVisible={isVisible}
    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
    animationIn={'slideInUp'}
    animationOut={'slideOutDown'}
    onBackdropPress={() => setIsVisible(null)}
    >
            <Text style={styles.mediumText}>Join Team</Text>
            <TextInput
            id='serialkey'
            placeholder='Enter Team Serial Key'
            placeholderTextColor={"grey"}
            autoCapitalize='none'
            style={styles.input}
            value={serialkey} 
            onChangeText={setSerialkey}
             />
            <Pressable 
            style={styles.btn}
            onPress={() => handleJoinTeam(serialkey)} >
                <Text style={{color: "white"}}>Join Team</Text>
            </Pressable>
            <Pressable 
            style={styles.btn}
            onPress={() => setIsVisible(null)} >
                <Text style={{color: "white"}}>Back</Text>
            </Pressable>
            {error && <Text>{error}</Text>}

    </Modal>
  )
}


