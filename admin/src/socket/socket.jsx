import { io } from 'socket.io-client'

export const socket = io("https://doctorfull.onrender.com", {
    transports: ["websocket", "polling"],
    autoConnect: true
});