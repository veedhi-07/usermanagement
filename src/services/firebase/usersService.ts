import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./index";

export const usersService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id: string, data: any) => {
    return updateDoc(doc(db, "users", id), data);
  },

  delete: async (id: string) => {
    return deleteDoc(doc(db, "users", id));
  },
};
