import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import { handlePickAvatar } from '../utils/handlePickAvatar'
import { getImage } from '../services/firebaseRequests'
import { useDispatch, useSelector } from 'react-redux'
import { triggerReRender } from "../redux/slices/reRenderSlice";
import { RootState } from "../redux/types/types";




export default function ProfilePicture({id, size, type, allowPress}) {
    const [imageURL, setImageURL] = useState('')
    const [startUpload, setStartUpload] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const reRender = useSelector((state: RootState) => state.reRender);
    //MANUAL INPUTS
    //insert userId for profile picture
    //insert teamSerialKey for team picture
    //insert pollId for poll picture (not implemented yet)

    //TYPES
    //user
    //team
    //poll (not implemented yet)

    //if no id is provided, return default profile picture
    //if id is provided, return profile picture from database
    useEffect(() => {
        setIsLoading(true);
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
        setIsLoading(false);
      }, [id, type, dispatch, reRender]);


      const handlePickAndTriggerReRender = async (id, type) => {
        try{
          await handlePickAvatar(id, type, (progress) => {
            setStartUpload(true);
          });
          dispatch(triggerReRender(!reRender));
          console.log(reRender)
        } catch (error) {
          console.error(error);
        }finally{
          setStartUpload(false);
        }
      }

      

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
    <View 
    style={[startUpload && {opacity: 0.5}]}
    >
    {allowPress ? (
      <TouchableOpacity
        onPress={() => {
          handlePickAndTriggerReRender(id, type);
        }}
      >
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          noUserImage()
        )}
      </TouchableOpacity>
    ) : (
      <View>
        {imageURL ? (
          <Image source={{ uri: imageURL }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          noUserImage()
        )}
      </View>
    
    )}
  
  </View>
)
}