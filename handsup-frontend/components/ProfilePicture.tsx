import React, { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { handlePickAvatar } from '../utils/handlePickAvatar'
import { getImage } from '../services/firebaseRequests'
import { useDispatch, useSelector } from 'react-redux'
import { triggerReRender } from "../redux/slices/reRenderSlice";
import { RootState } from "../redux/types/types";
import { LogBox } from 'react-native'
import CachedImage from 'expo-cached-image'
import Loading from '../screens/Loading'


LogBox.ignoreAllLogs(true)

export default function ProfilePicture({ id, size, type, allowPress }) {
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
    if (id && type) {
      getImageURL();
    } else {
      setImageURL('');
    }
  }, [id, type, dispatch, reRender]);

  const getImageURL = async () => {
    setIsLoading(true);
    try {
      const image = await getImage(id, type);
      if (image) {
        setImageURL(image);
      }
    } catch (error) {
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  }


  const handlePickAndTriggerReRender = async (id, type) => {
    try {
      await handlePickAvatar(id, type, (progress) => {
        setStartUpload(true);
        setIsLoading(true);
      });
      dispatch(triggerReRender(!reRender));
      console.log(reRender)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setStartUpload(false);
    }
  }

  const noUserImage = () => {
    switch (type) {
      case "user":
        return (
          <Ionicons name="person-circle-outline" size={size} color="white" />
        )
      case "team":
        return (
          <Ionicons name="people-circle-outline" size={size} color="white" />
        )
      case "poll":
        return (
          <Ionicons name="person-circle-outline" size={size} color="white" />
        )
    }
  }

  if(isLoading) return <ActivityIndicator style={{ width: size, height: size, borderRadius: size / 2 }} />

  return (
    imageURL ? (
      <View
        style={[startUpload && { opacity: 0.5 }]}>
        <TouchableOpacity
          disabled={!allowPress}
          onPress={() => {
            handlePickAndTriggerReRender(id, type);
          }}
        >
          <CachedImage
            style={{ width: size, height: size, borderRadius: size / 2 }}
            source={{ uri: imageURL }}
            cacheKey={`${id}-${type}`}
            resizeMode="cover"
            
          />
        </TouchableOpacity>
      </View>
    ) : (
      <View
        style={[startUpload && { opacity: 0.5 }]}>
        <TouchableOpacity
          disabled={!allowPress}
          onPress={() => {
            handlePickAndTriggerReRender(id, type);
          }
          }
        >
          {noUserImage()}
        </TouchableOpacity>
      </View>
    )
  )
}
