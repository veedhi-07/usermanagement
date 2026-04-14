import { Server, Socket } from "socket.io";
import admin from "../firebase/index";
import { db } from "../firebase/index";
import { Message, conversation } from "../types/index";

export const chatHandler = (io: Server, socket: Socket) => {
  const userId = socket.data.user.uid;
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("joinConversation", (conversationId: string) => {
    socket.join(conversationId);
  });

  //SEND MESSAGE
  socket.on(
    "sendMessage",
    async ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: Message;
    }) => {
      try {
        const ref = db
          .collection("conversation")
          .doc(conversationId)
          .collection("messages");

        const doc = await ref.add({
          ...message,
          senderId: userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const newMessage: Message = {
          ...message,
          senderId: userId,
          id: doc.id,
          createdAt: admin.firestore.Timestamp.now(),
        };

        //Emit message
        io.to(conversationId).emit("newMessage", newMessage);

        //Update last message
        await db.collection("conversation").doc(conversationId).update({
          lastMessage: message.text,
          lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.error(err);
      }
    },
  );

  //CREATE CONVERSATION
  socket.on(
    "createConversation",
    async (
      data: Omit<conversation, "createdAt" | "lastMessageAt">,
      callback: (res: any) => void,
    ) => {
      try {
        const doc = await db.collection("conversation").add({
          ...data,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastMessage: "",
          lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        callback({ id: doc.id });
      } catch {
        callback({ error: true });
      }
    },
  );

  //MARK AS READ
  socket.on("markAsRead", async ({ conversationId }) => {
    const ref = db
      .collection("conversation")
      .doc(conversationId)
      .collection("messages");

    const snapshot = await ref.get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as Message;

      if (!data.seenBy.includes(userId) && data.senderId !== userId) {
        batch.update(doc.ref, {
          seenBy: [...data.seenBy, userId],
          read: true,
        });
      }
    });

    await batch.commit();

    io.to(conversationId).emit("messagesRead", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};
