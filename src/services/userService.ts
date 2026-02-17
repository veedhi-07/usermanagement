// services/userService.ts
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { DocumentData, UpdateData } from "firebase/firestore";
import { db } from "../components/firebase";

// Interface for profile data
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

// Fetch user profile from Firestore
 export const fetchUserProfile = async (uid: string, email: string): Promise<ProfileData> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as ProfileData;
  } else {
    // Return default values if user document does not exist
    return { firstName: "", lastName: "", email, phone: "", role:"" };
  }
};

// Update user profile in Firestore
export const updateUserProfile = async ({
  uid,
  data,
}: {
  uid: string;
  data: ProfileData;
}): Promise<ProfileData> => {
  const userRef = doc(db, "users", uid);

  // TypeScript-safe cast for Firestore
  await updateDoc(userRef, data as unknown as UpdateData<DocumentData>);

  // Fetch updated profile to return
  const updatedDoc = await getDoc(userRef);
  return updatedDoc.data() as ProfileData;
};

export default { fetchUserProfile, updateUserProfile };