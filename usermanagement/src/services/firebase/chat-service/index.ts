// import {
//   collection,
//   getDocs,
//   updateDoc,
//   query,
//   doc,
//   addDoc,
//   getDoc,
//   orderBy,
//   onSnapshot,
//   arrayUnion,
// } from "firebase/firestore";
// import { db } from "../index";
// import type { conversation, Message } from "../../../types";

// export const chatsService = {

//   getAll: async (q?: any) => {
//     const snapshot = q
//       ? await getDocs(q)
//       : await getDocs(collection(db, "conversation"));

//     return {
//       chats: snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<conversation, "id">),
//       })),
//       lastDoc: snapshot.docs[snapshot.docs.length - 1],
//     };
//   },

//   getById: async (id: string) => {
//     const snapshot = await getDoc(doc(db, "conversation", id));

//     if (!snapshot.exists()) return null;
//     return {
//       id: snapshot.id,
//       ...(snapshot.data() as Omit<conversation, "id">),
//     };
//   },

//   update: async (id: string, data: Partial<conversation>) => {
//     return updateDoc(doc(db, "conversation", id), data);
//   },

//   create: async (data: Omit<conversation, "id">) => {
//     return addDoc(collection(db, "conversation"), data);
//   },

  // markAsRead: async (conversationId: string, userId: string) => {
  //   const q = query(collection(db, "conversation", conversationId, "messages"));

  //   const snapshot = await getDocs(q);

  //   const updates: Promise<void>[] = [];

  //   snapshot.docs.forEach((docSnap) => {
  //     const data = docSnap.data();

  //     if (data.senderId !== userId && !data.seenBy?.includes(userId)) {
  //       updates.push(
  //         updateDoc(docSnap.ref, {
  //           seenBy: arrayUnion(userId),
  //         }),
  //       );
  //     }
  //   });
  //   await Promise.all(updates);
  // },

//   PrevMessages: (
//     conversationId: string,
//     callback: (messages: Message[]) => void,
//   ) => {
//     const q = query(
//       collection(db, "conversation", conversationId, "messages"),
//       orderBy("createdAt", "asc"),
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<Message, "id">),
//       }));

//       callback(msgs);
//     });

//     return unsubscribe;
//   },

//   addUserToGroup: async (conversationId: string, userId: string) => {
//     const convoRef = doc(db, "conversation", conversationId);
//     const snapshot = await getDoc(convoRef);

//     if (!snapshot.exists()) {
//       return { error: "A" };
//     }

//     const data = snapshot.data();
//     const participants: string[] = data.participants || [];

//     if (participants.includes(userId)) {
//       return { error: "B" };
//     }

//     await updateDoc(convoRef, {
//       participants: arrayUnion(userId),
//     });
//     return { success: true };
//   },

//   addMessage: async (conversationId: string, message: Message) => {
//     const messagesRef = collection(
//       db,
//       "conversation",
//       conversationId,
//       "messages",
//     );
//     const docRef = await addDoc(messagesRef, message);
//     return docRef;
//   },
// };
import {
  collection,
  getDocs,
  updateDoc,
  query,
  doc,
  addDoc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../index";
import type { conversation, Message } from "../../../types";

export const chatsService = {
  //  GET ALL CONVERSATIONS
  getAll: async (q?: any) => {
    const snapshot = q
      ? await getDocs(q)
      : await getDocs(collection(db, "conversation"));

    return {
      chats: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<conversation, "id">),
      })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
  },

  //  GET SINGLE CONVERSATION
  getById: async (id: string) => {
    const snapshot = await getDoc(doc(db, "conversation", id));

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<conversation, "id">),
    };
  },

  //  UPDATE CONVERSATION
  update: async (id: string, data: Partial<conversation>) => {
    return updateDoc(doc(db, "conversation", id), data);
  },

  //  CREATE CONVERSATION
  create: async (data: Omit<conversation, "id">) => {
    return addDoc(collection(db, "conversation"), data);
  },

  //  FETCH MESSAGES
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const q = query(
      collection(db, "conversation", conversationId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Message, "id">),
    }));
  },

  //  ADD USER TO GROUP
  addUserToGroup: async (conversationId: string, userId: string) => {
    const convoRef = doc(db, "conversation", conversationId);
    const snapshot = await getDoc(convoRef);

    if (!snapshot.exists()) {
      return { error: "Conversation not found" };
    }

    const data = snapshot.data();
    const participants: string[] = data.participants || [];

    if (participants.includes(userId)) {
      return { error: "User already in group" };
    }

    await updateDoc(convoRef, {
      participants: [...participants, userId],
    });

    return { success: true };
  },
};
