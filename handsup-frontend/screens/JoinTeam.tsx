import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import styles from '../styles/styles'
import { checkUserInTeam, insertUserIntoTeam } from '../services/firebaseRequests'
import Loading from './Loading'
import { setIsLoading } from '../redux/slices/loadingSlice'
import Modal from 'react-native-modal'
import { RootState, User } from '../redux/types/types'
import { useSelector } from 'react-redux'
import LottieView from 'lottie-react-native'
import { triggerReRender } from '../redux/slices/reRenderSlice'
import { useDispatch } from 'react-redux'

export default function JoinTeam({ isVisible, setIsVisible }) {
    const dispatch = useDispatch()
    const user: User = useSelector((state: RootState) => state.user)
    const reRender = useSelector((state: RootState) => state.reRender)
    const [serialkey, setSerialkey] = useState('')
    const [successful, setSuccessful] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(user)
        console.log('user in join team')
        if (successful) {
            console.log('successful')
        }
    }, [successful])

    const handleJoinTeam = async (serialkey: string) => {
        setIsLoading(true)
        if(serialkey.trim() === '') {
            setError('Please enter a serial key')
            return
            }
        try {
            const alreadyMember = await checkUserInTeam(user.id, serialkey)
            console.log(alreadyMember)
            if (!alreadyMember) {
                    const insertUser = await insertUserIntoTeam(user.id, serialkey, false)
                    console.log(insertUser)
                    Alert.alert('Team Joined', 'You have successfully joined the team')
                    setIsVisible(null)
            } else {
                setError('Already a member of this team')
                return
            }
        } catch (error) {
            console.log("pepe")
            setError(error.message)
        } finally {
            dispatch(triggerReRender(!reRender))
            setLoading(false)
        }
    }

    if (loading) return <Loading />


    return (
        <Modal
            isVisible={isVisible}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            animationIn={'zoomIn'}
            backdropOpacity={0.9}
            animationInTiming={500}
            animationOutTiming={500}
            hideModalContentWhileAnimating={true}
            onBackdropPress={() => setIsVisible(null)}
        >
            <LottieView
                source={require('../assets/animations/jointeam.json')}
                autoPlay
                style={{
                    width: 200,
                    height: 200,
                    marginBottom: 20

                }}
            />
            <TextInput
                id='serialkey'
                placeholder='Enter Team Serial Key'
                placeholderTextColor={"grey"}
                autoCapitalize='none'
                style={styles.input}
                value={serialkey}
                onChangeText={setSerialkey}
                onChange={() => setError('')}
            />
            <Pressable
                style={styles.btn}
                onPress={() => handleJoinTeam(serialkey)} >
                <Text style={{ color: "white" }}>Join Team</Text>
            </Pressable>
            {error && <Text style={styles.smallText}>{error}</Text>}
        </Modal>
    )
}


