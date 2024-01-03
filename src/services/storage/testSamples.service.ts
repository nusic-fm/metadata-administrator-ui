import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase.service";

//TODO
const FOLDER_NAME = "test_remixer";

const uploadAudioFromFile = async (
  id: string,
  audioFile: Blob | Uint8Array | ArrayBuffer,
  name: string
) => {
  const storageRef = ref(storage, `${FOLDER_NAME}/${id}/${name}`);
  const snapshot = await uploadBytes(storageRef, audioFile);
  return snapshot.ref.fullPath;
};

const getRemixUrl = async (id: string, name: string): Promise<string> => {
  const storageRef = ref(storage, `${FOLDER_NAME}/${id}/${name}`);
  return getDownloadURL(storageRef);
};
export { uploadAudioFromFile, getRemixUrl };
