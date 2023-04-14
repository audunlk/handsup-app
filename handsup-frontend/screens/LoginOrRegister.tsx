import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Header from '../components/Header'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import styles from '../styles/styles'
import { auth, db } from '../firebase/firebase'
import transformError from '../utils/transformError'
import { Dispatch } from '@reduxjs/toolkit'
import { setIsLoggedIn } from '../redux/slices/loggedInSlice'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/slices/userSlice'
import { setIsLoading } from '../redux/slices/loadingSlice'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createUser } from '../services/firebase'


export default function LoginOrRegister({ navigation }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    const handleLogin = async () => {
        await signInWithEmailAndPassword(auth, email, password)
            .then(async () => {
                console.log('User logged in successfully');
                const accessToken = await auth.currentUser.getIdToken()
                await AsyncStorage.setItem('handsup-token', accessToken)
                dispatch(setIsLoggedIn(true))
                navigation.navigate('Home')
            })
            .catch(error => {
                console.error('Error logging in:', error.message, error.code);
                setError(transformError(error.code))
            });

    };

    const handleRegister = async () => {
        if (AsyncStorage.getItem('handsup-token')) {
            await AsyncStorage.clear()
        }
        try {
            await createUser(auth, db, email, password)
            dispatch(setIsLoggedIn(true))
            navigation.navigate('Home')
        } catch (error) {
            console.log(error.code)
            setError(transformError(error.code))
        }
    };

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
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
