import {
  addDoc,
  collection,
  doc,
  // getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "test_remixer";

const createDocId = (): string => {
  const d = doc(collection(db, DB_NAME));
  return d.id;
};
const createDocFromId = async (
  collectionName: string,
  id: string,
  data: any
): Promise<void> => {
  const d = doc(db, collectionName, id);
  await setDoc(d, data);
};
const setDocById = async (docId: string, data: any): Promise<void> => {
  const d = doc(db, DB_NAME, docId);
  await setDoc(d, data);
};

const createRemixDoc = async (data: any): Promise<string> => {
  const d = collection(db, DB_NAME);
  const docRef = await addDoc(d, data);
  return docRef.id;
};
const updateDocById = async (docId: string, data: any): Promise<void> => {
  const d = doc(db, DB_NAME, docId);
  await updateDoc(d, data);
};

export {
  createDocId,
  setDocById,
  createDocFromId,
  updateDocById,
  createRemixDoc,
};
