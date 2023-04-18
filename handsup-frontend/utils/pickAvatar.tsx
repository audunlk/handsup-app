import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebase/firebase';
import { uploadImageBlob } from '../services/firebaseRequests';

export const handlePickAvatar = async (id: string, type: string) => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log({result});
        if (!result.canceled) {
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            const finishedWhen = await uploadImageBlob(blob, id, type);
            console.log(result.assets[0].uri);
            return result;
          }
          console.log('User cancelled image picker');
    } catch (error) {
        console.log(error);
    }
}