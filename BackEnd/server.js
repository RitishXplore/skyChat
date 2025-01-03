/** -------------------------------
 *  Server Initialization
 * --------------------------------
 * @fileoverview Entry point for starting the server.
 * Binds the application to a specific port and logs its status.
 */

// Dependencies
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "./src/config/config.env.js";
import { Message,Chat } from "./src/api/chat/models/singleChat.model.js";

const { PORT, BASE_URL } = config;
const Port = PORT || 6502;

// Logger Utility
const logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`),
};

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"],
    },
});

// Socket.IO Connection Logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (chatId) => {
        socket.join(chatId);
    });

    // Send message event
    socket.on("sendMessage", async (message) => {
        try {
            // Destructure the message data
            const { chatId, sender, content, media, isEncrypted, encryptionKey } = message;

            // Save message to database
            const newMessage = new Message({
                chatId,
                sender,
                content,
                media,
                isEncrypted,
                encryptionKey,
            });

            // Save the message to the database
            const savedMessage = await newMessage.save();
            
            // Update the chat's last message
            await Chat.findByIdAndUpdate(chatId, { lastMessage: savedMessage._id });
       
            // Emit the saved message back to all clients in the chat room
            io.to(chatId).emit("receiveMessage", savedMessage);
        } catch (error) {
            logger.error("Error sending message: ", error);
        }
    });

    socket.on("leaveRoom", (chatId) => {
        socket.leave(chatId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start HTTP + Socket.IO Server
server.listen(Port, () => {
    logger.info(`🚀 Server is running at ${BASE_URL}:${Port}`);
});
