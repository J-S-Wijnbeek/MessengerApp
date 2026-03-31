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

const triggerWordsConfig = require("./triggerWords.json");
const triggerWords = Array.isArray(triggerWordsConfig.triggerWords)
  ? triggerWordsConfig.triggerWords.map((word) => word.toLowerCase())
  : [];

const chatHistory = {};

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("join_chat", (chatId) => {
        console.log("join_chat", chatId, "socket", socket.id);
        socket.join(chatId);
        const history = chatHistory[chatId] || [];
        socket.emit("chat_history", { chatId, history });
    });

    socket.on("chat_message", (msg) => {
        const normalizedMsg = {
            ...msg,
            timestamp: msg.timestamp || msg.time || new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            read: msg.read === true,
        };

        console.log("chat_message", normalizedMsg);
        const chatId = normalizedMsg.chatId;
        if (!chatHistory[chatId]) chatHistory[chatId] = [];
        chatHistory[chatId].push(normalizedMsg);

        const normalizedMessage = String(normalizedMsg.message || "").toLowerCase();
        const messageTokens = normalizedMessage.split(/\W+/).filter(Boolean);
        const matches = triggerWords.filter((word) => messageTokens.includes(word));
        if (matches.length > 0) {
            const warning = {
                chatId,
                matches,
                message: normalizedMsg.message,
            };
            console.log("Trigger words detected:", matches, "in chat", chatId, "message:", normalizedMsg.message);
            console.log("Emitting trigger warning to sender and room", chatId);
            socket.emit("trigger_warning", warning);
            io.to(chatId).emit("trigger_warning", warning);
        }

        io.to(chatId).emit("chat_message", normalizedMsg);
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