import express from "express";
import http from "http";
import { Server } from "socket.io";
import admin from "./firebase";
import { chatHandler } from "./socket/chathandler";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const attempts = new Map();

io.use((socket, next) => {
  const ip = socket.handshake.address;

  const count = attempts.get(ip) || 0;

  if (count >= 5) {
    return next(new Error("Too many connection attempts"));
  }

  attempts.set(ip, count + 1);

  setTimeout(() => {
    attempts.set(ip, attempts.get(ip) - 1);
  }, 60000); // reset after 1 min

  next();
});

// 1. AUTH MIDDLEWARE (ADD HERE)
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log("Incoming token:", token); //

    if (!token) {
      console.log(" No token provided");
      return next(new Error("No token provided"));
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    console.log(" Token verified for user:", decoded.uid); //

    //  attach user to socket
    socket.data.user = decoded;

    next();
  } catch (err) {
    console.log("Auth error:", err);
    next(new Error("Unauthorized"));
  }
});

//  2. SOCKET CONNECTION (AFTER middleware)
io.on("connection", (socket) => {
  const user = socket.data.user;

  console.log("User connected:", user.uid, socket.id);

  // join personal room
  socket.join(user.uid);

  chatHandler(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", user.uid, socket.id);
  });
});

//  Test route
app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
