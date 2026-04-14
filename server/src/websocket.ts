import { WebSocketServer, WebSocket } from "ws";
import { auth, db } from "../firebase/index";
import { Server as HTTPServer } from "http";
import { ClientMessage, ServerMessage } from "./types";

// userId → socket
const users = new Map<string, WebSocket>();

// conversationId → set of userIds
const rooms = new Map<string, Set<string>>();

export const initWebSocket = (server: HTTPServer) => {
    const wss = new WebSocketServer({server});

  console.log("Websocket runningb on same port as http")
  wss.on("connection", async (ws, req) => {
    try {
      // AUTH
      const url = new URL(req.url || "", "http://localhost");
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close();
        return;
      }

      const decoded = await auth.verifyIdToken(token);
      const userId = decoded.uid;

      (ws as any).userId = userId;
      users.set(userId, ws);

      console.log("User connected:", userId);

      //  HANDLE MESSAGES
      ws.on("message", async (msg) => {
        try {
          const data: ClientMessage = JSON.parse(msg.toString());

          switch (data.type) {
            //JOIN ROOM
            case "JOIN_CONVERSATION": {
              const { conversationId } = data;

              if (!rooms.has(conversationId)) {
                rooms.set(conversationId, new Set());
              }

              rooms.get(conversationId)?.add(userId);
              break;
            }

            //  LEAVE ROOM
            case "LEAVE_CONVERSATION": {
              const { conversationId } = data;
              rooms.get(conversationId)?.delete(userId);
              break;
            }

            //  SEND MESSAGE
            case "SEND_MESSAGE": {
              const { conversationId, message } = data.payload;

              const docRef = await db
                .collection("conversation")
                .doc(conversationId)
                .collection("messages")
                .add({
                  ...message,
                  createdAt: new Date(),
                });

              const fullMessage = {
                id: docRef.id,
                ...message,
              };

              //  BROADCAST to room
              const roomUsers = rooms.get(conversationId);

              roomUsers?.forEach((uid) => {
                const client = users.get(uid);

                if (client && client.readyState === WebSocket.OPEN) {
                  const payload: ServerMessage = {
                    type: "NEW_MESSAGE",
                    message: fullMessage,
                  };

                  client.send(JSON.stringify(payload));
                }
              });

              break;
            }

            //  MARK AS READ
            case "MARK_AS_READ": {
              const { conversationId, userId } = data.payload;

              // (optional: update Firestore seenBy here)
              const roomUsers = rooms.get(conversationId);

              roomUsers?.forEach((uid) => {
                const client = users.get(uid);

                if (client && client.readyState === WebSocket.OPEN) {
                  const payload: ServerMessage = {
                    type: "MESSAGES_READ",
                    conversationId,
                  };

                  client.send(JSON.stringify(payload));
                }
              });
              break;
            }
          }
        } catch (err) {
          console.error("Invalid message:", err);
        }
      });

      // DISCONNECT
      ws.on("close", () => {
        users.delete(userId);

        rooms.forEach((set) => set.delete(userId));

        console.log("User disconnected:", userId);
      });
    } catch (err) {
      console.error("Auth error:", err);
      ws.close();
    }
  });

  console.log("WebSocket running on ws://localhost:5000");
};
