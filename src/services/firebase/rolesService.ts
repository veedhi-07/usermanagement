import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./index";
import type { Role } from "../../types";

export const rolesService = {
  getAll: async () => {
    const snapshot = await getDocs(collection(db, "roles"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Role, "id">),
    }));
  },

  getById: async (id: string) => {
    const snapshot = await getDoc(doc(db, "roles", id));

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Role, "id">),
    };
  },

  create: async (data: Omit<Role, "id">) => {
    return addDoc(collection(db, "roles"), data);
  },

  update: async (id: string, data: Partial<Role>) => {
    return updateDoc(doc(db, "roles", id), data);
  },

  delete: async (id: string) => {
    return deleteDoc(doc(db, "roles", id));
  },
};
