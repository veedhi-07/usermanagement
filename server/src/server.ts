import express from "express";
import http from "http";
import { initWebSocket } from "./websocket";

const app = express();
const server = http.createServer(app);
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("API running");
});

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
