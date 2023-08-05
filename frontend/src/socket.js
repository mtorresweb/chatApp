import io from "socket.io-client";

const endPoint = "http://localhost:3001";

export const socket = io(endPoint);
