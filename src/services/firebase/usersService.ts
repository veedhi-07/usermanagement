import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  getDoc,
  Query,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "./index";
import type { User } from "../../types";

export const usersService = {
  getAll: async (q?: Query<DocumentData>) => {
    const snapshot = q
      ? await getDocs(q)
      : await getDocs(collection(db, "users"));

    return {
      users: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      })),
      lastDoc: snapshot.docs.length
        ? snapshot.docs[snapshot.docs.length - 1]
        : null,
    };
  },
  getById: async (id: string) => {
    const userDoc = await getDoc(doc(db, "users", id));

    if (!userDoc.exists()) return null;

    return {
      id: userDoc.id,
      ...(userDoc.data() as Omit<User, "id">),
    };
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
