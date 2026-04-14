import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { io, Socket } from "socket.io-client";
let socket: Socket;

export const initSocket = () => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (!user) {
      console.log(" No user logged in");
      return;
    }

    const token = await user.getIdToken();

    socket = io("http://localhost:5000", {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socket.connect();
    socket.on("connect", () => {
      console.log(" Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });
  });
};

export const getSocket = () => socket;
