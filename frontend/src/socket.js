import io from "socket.io-client";

const endPoint = import.meta.env.VITE_API_URL;

export const socket = io(endPoint);
