const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the process using it or set PORT to another value.`);
        process.exit(1);
    }
    console.error('Server error:', error);
    process.exit(1);
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

    socket.on("join_staff", () => {
        console.log("join_staff", "socket", socket.id);
        socket.join("staff");
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

            if (normalizedMsg.senderType !== "staff") {
                console.log("Emitting urgent alert to staff for chat", chatId);
                io.to("staff").emit("urgent_alert", {
                    chatId,
                    matches,
                    message: normalizedMsg.message,
                });
            }
        }

        io.to(chatId).emit("chat_message", normalizedMsg);

        if (normalizedMsg.senderType === "client") {
            io.to("staff").emit("new_message", {
                chatId,
                preview: String(normalizedMsg.message || "").slice(0, 80),
                message: normalizedMsg.message,
                timestamp: normalizedMsg.timestamp,
            });
        }
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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});