import { Timestamp } from "firebase-admin/firestore";

export interface conversation {
  id?: string;
  createdAt: Timestamp;
  createdBy?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  type: "private" | "group";
  participants?: string[];
  //   senderId?: string;
  //   text?: string;
  //   name?: string;
}
export interface Message {
  id?: string;
  createdAt: Timestamp;
  senderId: string;
  receiverId?: string;
  text: string;
  type: "private" | "group";
  seenBy: string[];
  read: boolean;
}
