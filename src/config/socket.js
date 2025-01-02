import socket from "socket.io-client";

let socketInstance = null;

const initializeSocket = (projectId) => {
  const socketInstance = socket(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });
  return socketInstance;
};

const sendMessage = (eventName,data) => {
  socketInstance.emit(eventName, data);
};

const receiveMessage = (eventName,cb) => {
  socketInstance.on(eventName, cb);
};

export { initializeSocket, sendMessage, receiveMessage };
