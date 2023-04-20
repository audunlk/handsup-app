import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadImageBlob } from '../services/firebaseRequests';

export const handlePickAvatar = async (id: string, type: string, onProgress: (progress: number) => void): Promise<void> => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log({result});
      if (!result.canceled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
  
        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();
        await uploadImageBlob(blob, id, type, (progress) =>
            onProgress(progress)
        );
        console.log(result.assets[0].uri);
      }
      console.log('User cancelled image picker');
    } catch (error) {
      console.log(error);
    }
  }