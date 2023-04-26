import React, { useState } from 'react'
import { KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Header from '../components/Header'
import styles from '../styles/styles'
import transformError from '../utils/transformError'
import { setIsLoggedIn } from '../redux/slices/loggedInSlice'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { 
    createUser, 
    loginUser, 
    // googleSignInUser 
} from '../services/firebaseRequests'


export default function LoginOrRegister({ navigation }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    const handleLogin = async () => {
        try {
            await loginUser(email, password)
            dispatch(setIsLoggedIn(true))
        } catch (error) {
            console.log(error.code)
            setError(transformError(error.code))
        }
    };

    const handleRegister = async () => {
        if (AsyncStorage.getItem('handsup-token')) {
            await AsyncStorage.clear()
        }
        try {
            await createUser(email, password)
            dispatch(setIsLoggedIn(true))
        } catch (error) {
            console.log(error.code)
            setError(transformError(error.code))
        }
    };

    //Doesnt work in expo go
    // const handleGoogleSignIn = async () => {
    //     try {
    //         await googleSignInUser()
    //         dispatch(setIsLoggedIn(true))
    //     } catch (error) {
    //         console.log(error.code)
    //         setError(transformError(error.code))
    //     }
    // };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Header navigation={navigation} title="Login or Register" showExit={false} />
            <View style={styles.body}>
                <Text style={styles.smallText}>{error}</Text>
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    placeholder="email"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChange={() => { setError('') }}
                />
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    placeholder="Password"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onChange={() => { setError('') }}
                />
                <View style={styles.btn}>
                    <TouchableOpacity
                        onPress={handleLogin}
                    >
                        <Text style={styles.mediumText}>Log in</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btn}>
                    <TouchableOpacity
                        onPress={handleRegister}
                    >
                        <Text style={styles.mediumText}>Register</Text>
                    </TouchableOpacity>
                    {/* <GoogleSigninButton
                        style={{ width: '100%', height: 48 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={handleGoogleSignIn}
                    /> */}
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
