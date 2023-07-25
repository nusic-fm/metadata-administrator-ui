import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { IAliveUserDoc, ReleaseSoundXyz } from "../../models/IUser";
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
  userDoc: Partial<IAliveUserDoc>
): Promise<void> => {
  const d = doc(db, DB_NAME, walletAddress);
  await updateDoc(d, userDoc);
};

const SUB_DB_NAME = "releases";
const getArtistReleases = async (
  walletAddress: string
): Promise<null | ReleaseSoundXyz[]> => {
  const d = collection(db, DB_NAME, walletAddress, SUB_DB_NAME);
  const docsRef = await getDocs(d);
  if (docsRef.size) {
    return docsRef.docs.map((d) => d.data()) as ReleaseSoundXyz[];
  } else {
    return null;
  }
};

const updateArtistReleases = async (
  walletAddress: string,
  colletionsWithCredits: ReleaseSoundXyz[]
) => {
  const batch = writeBatch(db);
  colletionsWithCredits.map((c) => {
    const ref = doc(
      db,
      DB_NAME,
      walletAddress,
      SUB_DB_NAME,
      c.collectionAddress
    );
    batch.set(ref, c);
  });
  await batch.commit();
};

export {
  getOrCreateUserDoc,
  updateUserDoc,
  getArtistReleases,
  updateArtistReleases,
};
