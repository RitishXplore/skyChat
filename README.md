# SkyChat

SkyChat is a dynamic messaging and communication platform designed for seamless interaction among multiple users. It supports real-time messaging, voice/video calls, group chats, and advanced presence tracking. Built with scalability and performance in mind, SkyChat leverages modern technologies like **Node.js**, **React**, **MongoDB**, and **Socket.IO**.

## 🚀 Key Features

### 🔑 User Authentication
- Email and phone verification.
- Integration with **Google**, **GitHub**, and **Facebook** authentication providers.

### 💬 Real-time Messaging
- 1:1 and group messaging.
- Support for text, images, videos, and file sharing.
- Chat status indicators: **Sent**, **Delivered**, **Read**.

### 📞 Voice & Video Calls
- One-on-one and group calls.
- Call statuses: **Ongoing**, **Ended**, **Missed**.

### 👥 Group Management
- Create and manage groups.
- Add/Remove members and assign roles (**Admin**/**Member**).

### 🛡️ User Profile & Privacy
- Customizable profile with **profile picture**, **status**, and **name**.
- Privacy and notification settings.

### 🟢 Presence Tracking
- Real-time online/offline status.
- Last active timestamps.

### ❤️ Message Reactions
- React to messages with emojis.

### 🔔 Notifications
- Push notifications for messages, calls, mentions, and activities.

### 🚫 Blocked List & Reporting
- Block or report inappropriate users.

### 📊 Polls
- Create and vote in group polls.

### 🔒 Encryption
- End-to-end encryption for secure messaging.

---

## 🛠️ Backend Structure

SkyChat's backend is powered by **Node.js**, **Express.js**, and **MongoDB**. Below are key database models:

- **User Model**: Manages user data, authentication, and status.
- **OTP Model**: Tracks one-time passwords for email/phone verification.
- **Session Model**: Handles user authentication sessions.
- **Group Model**: Manages group metadata, members, and roles.
- **Chat Model**: Stores direct and group messages.
- **Call Model**: Tracks call sessions and statuses.
- **Verification Model**: Stores verification tokens.
- **Settings Model**: Manages user preferences.
- **Presence Model**: Tracks user online activity.
- **BlockedList Model**: Manages blocked users.
- **Polls Model**: Tracks polls and voting in groups.

---

## 🏗️ Future Enhancements

1. **Scalability Enhancements**
   - Implement **Redis** for caching and session management.
   - Use **Kafka** and **RabbitMQ** for real-time event handling.

2. **Mobile Applications**
   - Build native **iOS/Android** apps using **React Native**.

3. **Admin Dashboard**
   - Web-based panel for monitoring and managing app activities.

4. **Advanced Analytics**
   - Insights on user activity and app performance.

---

## ⚙️ Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local/cloud instance)

### Setup


1. **Clone the Repository**  
   ```bash
   git clone https://github.com/RitishXplore/skyChat.git
   cd skyChat
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Environment Configuration**  
   Create a `.env` file and add:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/skychat
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GITHUB_CLIENT_ID=your_github_client_id
   FACEBOOK_APP_ID=your_facebook_app_id
   ```

4. **Start the Server**  
   ```bash
   npm start
   ```
   Server runs on: `http://localhost:3001`

---

## 🤝 **Contributing**

We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch:  
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:  
   ```bash
   git commit -am 'Add new feature'
   ```
4. Push your branch:  
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## 📄 **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 📬 **Contact**

- **GitHub:** [RitishXplore](https://github.com/RitishXplore)  
- **Email:** [ritishup07@gmail.com](mailto:ritishup07@gmail.com)  
- **LinkedIn:** [Ritish Kumar](https://www.linkedin.com/in/ritish-kumar-4029971b7)  

---

Start connecting and communicating effortlessly with **SkyChat**! 🚀✨
```

