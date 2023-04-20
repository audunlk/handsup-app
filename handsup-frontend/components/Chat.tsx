//chat screen for the application using FCM and realtime database
//gifted chat

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView, Alert } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebase/firebase';
import { getChatById, getImage, insertChat } from '../services/firebaseRequests';
import { User } from '../redux/types/types';
import { useSelector } from 'react-redux';
import Header from './Header';
import styles from '../styles/styles';
import BottomNav from '../navigation/BottomNav';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import ProfilePicture from './ProfilePicture';


export default function Chat({ navigation, route }) {
    const user: User = useSelector((state: any) => state.user)
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [keyboard, setKeyboard] = useState(false);
    const [avatar, setAvatar] = useState('');

    const scrollViewRef = useRef();

    const getAvatar = async () => {
        const avatar = await getImage(user.id, 'user');
        setAvatar(avatar);
    }

    useEffect(() => {
        getAvatar();
    }, []);


    useEffect(() => {
        if (route.params.teamSerial) {
            getChatById(route.params.teamSerial)
                .then((chat) => {
                    setMessages(chat.messages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert('Error', 'An unexpected error occurred while getting chat');
                });
        } else {
            getChatById(route.params.pollId)
                .then((chat) => {
                    setMessages(chat.messages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert('Error', 'An unexpected error occurred while getting chat');
                });
        }
    }, [route.params.teamSerial, route.params.pollId]);

    useEffect(() => {
        if (user) {
            console.log({user})
            setName(user.username);
        }
    }, [user]);

    const sendMessage = () => {
        if (text) {
            const newMessage = {
                _id: uuidv4(),
                text,
                createdAt: new Date().toISOString(),
                user: {
                    _id: user.id,
                    name: user.username,
                    avatar: avatar || null
                },
            };
            if (route.params.teamSerial) {
                insertChat(route.params.teamSerial, newMessage)
                    .then(() => {
                        setText('');
                    })
                    .catch((err) => {
                        console.log(err);
                        Alert.alert('Error', 'An unexpected error occurred while sending message');
                    });
            } else {
                insertChat(route.params.pollId, newMessage)
                    .then(() => {
                        setText('');
                    })
                    .catch((err) => {
                        console.log(err);
                        Alert.alert('Error', 'An unexpected error occurred while sending message');
                    });
            }
            setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
        }
    };


    const handleKeyboard = () => {
        setKeyboard(true);
    };

    const handleKeyboardDismiss = () => {
        setKeyboard(false);
    };

    const sortedMessages = messages.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Header title={route.params.team.name} navigation={navigation} showExit={true} />
            <View style={[styles.body, { paddingBottom: 120 }]}>
                <GiftedChat
                    messages={sortedMessages}
                    onInputTextChanged={handleKeyboard}
                    user={{
                        _id: user.id,
                        name: user.username,
                        avatar: avatar
                    }}
                    renderUsernameOnMessage={true}
                    alwaysShowSend={true}
                    showUserAvatar={true}
                    showAvatarForEveryMessage={true}
                    renderAvatarOnTop={true}
                    renderAvatar={
                        (props) => {
                            return (
                                <Image
                                    source={{ uri: props.currentMessage.user.avatar }}
                                    style={{ width: 30, height: 30, borderRadius: 15 }}
                                />
                            );
                        }
                    }
                    renderBubble={(props) => {
                        return (
                            <Bubble
                                {...props}
                                wrapperStyle={{
                                    right: {
                                        backgroundColor: '#00BFFF',
                                    },
                                    left: {
                                        backgroundColor: '#F0F0F0',
                                    },
                                }}
                                textStyle={{
                                    right: {
                                        color: 'white',
                                    },
                                    left: {
                                        color: 'black',
                                    },
                                }}
                                // onLongPress={
                                //     (context, message) => {
                                //         handleReply(message);

                                // }
                            />
                        )}}
                    renderInputToolbar={(props) => (
                        <View style={styles.messageInputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Type a message"
                                placeholderTextColor={
                                    keyboard ? 'black' : 'grey'
                                }
                                value={text}
                                onChangeText={setText}
                            />
                            <View style={styles.messageInputButton}>
                                <TouchableOpacity onPress={sendMessage}>
                                <Ionicons name="send" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
            <BottomNav navigation={navigation} />

        </KeyboardAvoidingView>
    );
}






