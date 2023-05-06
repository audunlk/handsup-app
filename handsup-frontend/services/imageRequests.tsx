import { storage } from '../firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';


//IMAGE
export const uploadImageBlob = async (blob: Blob, id: string, type: string, onProgress: (progress: number) => void) => {
    return new Promise<void>(async (resolve, reject)  => {
      const storageRef = ref(storage, `/${type}/${id}`);
  
      const existingImageRef = ref(storage, `/${type}/${id}`);
      const existingImageSnapshot = await getDownloadURL(existingImageRef).catch(() => null);
  
      if (existingImageSnapshot) {
        await deleteObject(existingImageRef);
        console.log('Old image deleted')
      }
  
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        reject(error);
      }, () => {
        console.log('Image uploaded successfully');
        resolve();
      });
    });
  }

export const getImage = async (id: string, type: string) => {
    try{
        const storageRef = ref(storage, `${type}/${id}`);
        const url = await getDownloadURL(storageRef);
        return url ? url : null;
    }catch(err){
        console.log('Image not found');
    }
}

export const deleteImage = async (id: string, type: string) => {
    try{
        const storageRef = ref(storage, `${type}/${id}`);
        await deleteObject(storageRef);
        console.log('Image deleted successfully');
    }catch(err){
        console.log('Image not found');
    }
}
