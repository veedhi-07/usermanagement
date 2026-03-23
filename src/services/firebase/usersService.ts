import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "./index";
import type { User } from "../../types";

export const usersService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));
  },

  update: async (id: string, data: Partial<User>) => {
    return updateDoc(doc(db, "users", id), data);
  },

  delete: async (id: string) => {
    return deleteDoc(doc(db, "users", id));
  },
  create: async (data: Omit<User, "id">) => {
    return addDoc(collection(db, "users"), data);
  },
};
