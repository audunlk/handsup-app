//chat screen for the application using FCM and realtime database
//gifted chat

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Text, Alert, Image } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { db, auth, storage } from '../firebase/firebase';
import { getChatById, getImage, insertChat } from '../services/firebaseRequests';
import { User } from '../redux/types/types';
import { useSelector } from 'react-redux';
import Header from './Header';
import styles from '../styles/styles';
import BottomNav from '../navigation/BottomNav';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import ProfilePicture from './ProfilePicture';
import { ref, getDownloadURL } from 'firebase/storage';


export default function Chat({ navigation, route }) {
    const user: User = useSelector((state: any) => state.user)
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState('');
    const [chatName, setChatName] = useState(route.params.name)
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [keyboard, setKeyboard] = useState(true);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        
        getAvatar();
    }, [user]);


    useEffect(() => {
        if (route.params.teamSerial) {
            getChatById(route.params.teamSerial)
                .then((chat) => {
                    setMessages(chat.messages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            getChatById(route.params.pollId)
                .then((chat) => {
                    setMessages(chat.messages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [route.params.teamSerial, route.params.pollId]);

    useEffect(() => {
        if (user) {
            console.log({ user })
            setName(user.username);
        }
    }, [user]);

    
    const getAvatar = async () => {
        try {
            const avatar = await getImage(user.id, 'user');
            setAvatar(avatar);
        } catch (err) {
            console.log(err);
        }
    }

    const sendMessage = () => {
        if (text) {
            const newMessage = {
                _id: uuidv4(),
                text,
                createdAt: new Date().toISOString(),
                user: {
                    _id: user.id,
                    name: user.username,
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
            setText('');
        }
    };


    const handleKeyboard = () => {
        setKeyboard(!keyboard);
        console.log(keyboard)
    };

    const sortedMessages = messages.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <View style={styles.fullContainer}>
            <Header title={chatName} navigation={navigation} showExit={true} />
            <View style={[styles.body, keyboard ? {paddingBottom: 40} : {paddingBottom: 0}]}>
                <GiftedChat
                    messages={sortedMessages}
                    user={{
                        _id: user.id,
                        name: user.username,
                    }}
                    keyboardShouldPersistTaps='handled'
                    
                    renderUsernameOnMessage={true}
                    alwaysShowSend={true}
                    showUserAvatar={true}
                    showAvatarForEveryMessage={true}
                    renderAvatarOnTop={true}
                    renderAvatar={
                        (props) => {
                            return (
                                <ProfilePicture 
                                    id={props.currentMessage.user._id}
                                    size={40}
                                    type={"user"}
                                    allowPress={false}
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
                            />
                        )
                    }}
                    renderInputToolbar={(props) => (
                        <View style={styles.messageInputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Type a message"
                                placeholderTextColor={
                                    keyboard ? 'black' : 'grey'
                                }
                                onFocus={handleKeyboard}
                                onBlur={handleKeyboard}
                                returnKeyType='send'
                                returnKeyLabel='Send'
                                value={text}
                                onChangeText={setText}
                                onSubmitEditing={sendMessage}
                            />
                            <View style={styles.messageInputButton}>
                                <TouchableOpacity onPress={sendMessage}>
                                    <Text style={styles.smallText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                
            </View>
        </View>
    );
}