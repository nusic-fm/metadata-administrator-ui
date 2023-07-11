import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IAliveUserDoc, IUserDoc } from "../../models/IUser";
import { db } from "../firebase.service";

const DB_NAME = "users";

const getOrCreateUserDoc = async (
  walletAddress: string
): Promise<IAliveUserDoc> => {
  const d = doc(db, DB_NAME, walletAddress);
  const docRef = await getDoc(d);
  if (docRef.exists()) {
    return docRef.data() as IAliveUserDoc;
  } else {
    await setDoc(d, { walletAddress });
    return { walletAddress };
  }
};

const updateUserDoc = async (
  walletAddress: string,
  userDoc: { bio?: string; userName?: string }
): Promise<void> => {
  const d = doc(db, DB_NAME, walletAddress);
  await updateDoc(d, userDoc);
};

export { getOrCreateUserDoc, updateUserDoc };
