import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import { handlePickAvatar } from '../utils/pickAvatar'
import { getImage } from '../services/firebaseRequests'

export default function ProfilePicture({id, size, type}) {
    const [imageURL, setImageURL] = useState('')
    //MANUAL INPUTS
    //insert userId for profile picture
    //insert teamSerialKey for team picture
    //insert pollId for poll picture

    //TYPES
    //user
    //team
    //poll

    //if no id is provided, return default profile picture
    //if id is provided, return profile picture from database
    

    useEffect(() => {
        async function getImageURL() {
          try {
            const image = await getImage(id, type);
            if (image) {
              setImageURL(image);
            }
          } catch (error) {
            console.error(error);
          }
        }
        if (id && type) {
          getImageURL();
        } else {
          setImageURL('');
        }
      }, [id, type]);

    const noUserImage = () => {
        switch(type){
            case "user":
                return(
                    <Ionicons name="person-circle-outline" size={size} color="white" />
                )
            case "team":
                return(
                    <Ionicons name="people-circle-outline" size={size} color="white" />
                )
            case "poll":
                return(
                    <Ionicons name="person-circle-outline" size={size} color="white" />
                )       
        }
    }



  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          handlePickAvatar(id, type);
        }}
      >
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          noUserImage()
        )}
      </TouchableOpacity>
    </View>
  )
}
