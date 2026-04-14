let socket: WebSocket | null = null;

export const connectSocket = (token: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`ws://localhost:5000?token=${token}`);

  socket.onopen = () => {
    console.log(" connected");
  };

  socket.onclose = () => {
    console.log(" disconnected");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("socket error", err);
  };

  return socket;
};

export const getSocket = () => socket;
