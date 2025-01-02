// src/services/socket.js
import { io } from "socket.io-client";

// Replace with your server URL
const SOCKET_SERVER_URL = "http://localhost:4000";

const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
});

export default socket;
