const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const chatHistory = {};

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        const history = chatHistory[chatId] || [];
        socket.emit("chat_history", { chatId, history });
    });

    socket.on("chat_message", (msg) => {
        console.log("chat_message", msg);
        const chatId = msg.chatId;
        if (!chatHistory[chatId]) chatHistory[chatId] = [];
        chatHistory[chatId].push(msg);
        io.to(chatId).emit("chat_message", msg);
    });

    socket.on("read_chat", ({ chatId, readerType }) => {
        if (!chatHistory[chatId]) return;
        chatHistory[chatId] = chatHistory[chatId].map((msg) => ({
            ...msg,
            read: msg.senderType !== readerType ? true : msg.read,
        }));
        io.to(chatId).emit("chat_history", { chatId, history: chatHistory[chatId] });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server is running on port 3001");
});