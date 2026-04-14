// 🔹 Client → Server
export type ClientMessage =
  | JoinConversation
  | LeaveConversation
  | SendMessage
  | MarkAsRead;

export interface JoinConversation {
  type: "JOIN_CONVERSATION";
  conversationId: string;
}

export interface LeaveConversation {
  type: "LEAVE_CONVERSATION";
  conversationId: string;
}

export interface SendMessage {
  type: "SEND_MESSAGE";
  payload: {
    conversationId: string;
    message: {
      text: string;
      senderId: string;
      type: "private" | "group";
      seenBy: string[];
      read: boolean;
    };
  };
}

export interface MarkAsRead {
  type: "MARK_AS_READ";
  payload: {
    conversationId: string;
    userId: string;
  };
}

// 🔹 Server → Client
export type ServerMessage = NewMessage | MessagesRead | ErrorMessage;

export interface NewMessage {
  type: "NEW_MESSAGE";
  message: any;
}

export interface MessagesRead {
  type: "MESSAGES_READ";
  conversationId: string;
}

export interface ErrorMessage {
  type: "ERROR";
  message: string;
}
