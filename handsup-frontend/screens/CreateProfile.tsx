import React, { useState } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, Button } from 'react-native'

import Header from '../components/Header';
import styles from '../styles/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types/types';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../redux/slices/loadingSlice';
import { updateUser } from '../services/firebaseRequests';
import { setUser } from '../redux/slices/userSlice';
import { isValidFirstName, isValidLastName, isValidUsername } from '../utils/regex';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function CreateProfile({ navigation }) {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isEditable, setIsEditable] = useState(true);

    const checkValidity = () => {
        try {
            if (!isValidFirstName(firstName)) {
                throw new Error("First name must be at least 1 characters long and contain only letters.")
            }
            if (!isValidLastName(lastName)) {
                throw new Error("Last name must be at least 1 characters long and contain only letters.")
            }
            if (!isValidUsername(username)) {
                throw new Error("Username must be at least 3 characters long and contain only letters, numbers, dashes, and underscores.");
            }
            return true;
        } catch (error) {
            console.log(error.message)
            setError(error.message);
        }
    }

    const handleUpdateUser = async () => {
        dispatch(setIsLoading(true));
        if (checkValidity()) {
          console.log('Valid input');
      
          const updatedUser = {
            id: user.id,
            email: user.email,
            firstName,
            lastName,
            username,
          }
          try {
            await updateUser(user.id, updatedUser);
            console.log('User data updated successfully!');
            dispatch(setIsLoading(false));
            dispatch(setUser(updatedUser));
          } catch (error: unknown) {
            console.error('An error occurred while updating user data:', error);
            setError('An error occurred while updating user data. Please try again later.');
          }
        }
      };



    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}>
            <Header navigation={navigation} title="Create Profile" showExit={false} />
            <View style={styles.body}>
                <Text style={styles.mediumText}>{error}</Text>
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={username}
                    editable={isEditable}
                    onChangeText={setUsername}
                    placeholder="Username"
                    onChange={() => { setError("") }}
                />
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={firstName}
                    editable={isEditable}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    onChange={() => { setError("") }}
                />
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={lastName}
                    editable={isEditable}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    onChange={() => { setError("") }}
                />
                <View style={styles.btn}>
                    <TouchableOpacity onPress={handleUpdateUser}>
                        <Text style={styles.mediumText}>Create User</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

