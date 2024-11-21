# 🚀 FlashBot

FlashBot is a feature-packed Discord bot designed to streamline server management, engage community members, and provide entertainment with advanced functionalities like economy, moderation, and utility commands. It is built using **TypeScript**, **Discord.js**, and **MongoDB** for scalability and performance.

---

## 🌟 Features

- **Moderation**: Manage your server with tools like banning, nuking channels, and clearing messages.
- **Economy System**: Built-in virtual currency system for engaging server members.
- **Music Playback**: Play music from YouTube or Spotify with queue support.
- **Custom Polls**: Create polls with up to 6 options for community votes.
- **User Profiles**: Track user stats and display detailed information.
- **Invite Tracker**: Monitor user invites and generate invite stats.
- **Custom Greetings**: Configure welcome messages and images for new members.
- **Interactive Fun Commands**: Enjoy commands like checking avatars and playing mini-games.
- **Server Tools**: View game server statuses directly from Discord.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/xelvor/FlashBot.git
   ```

2. Navigate to the project directory:

   ```bash
   cd FlashBot
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the bot:
   Edit the `config.ts` file with your bot's configuration:

   ```typescript
   export const config = {
       token: "YOUR_DISCORD_BOT_TOKEN",
       client_id: "YOUR_DISCORD_CLIENT_ID",
       color: "#2BA6FF",
       server_name: "Your Server Name",
       mongo_db: "mongodb://localhost:27017",
       owner_role: "OWNER_ROLE_ID",
       prefix: "!"
   };
   ```

5. Compile the TypeScript files:

   ```bash
   npx tsc
   ```

6. Start the bot:

   ```bash
   npm start
   ```

---

## 📋 Commands List

### 🛠️ Moderation
- `!ban <@user> <reason>` - Bans a user from the server.
- `!unban <userID>` - Unbans a user by ID.
- `!nuke` - Deletes and recreates a channel.
- `!clear <number>` - Deletes the specified number of messages.

### 🎉 Fun
- `!ask-gpt <question>` - Ask GPT for an AI-powered response.
- `!avatar <@user> [type]` - Displays a user's avatar with optional customization (e.g., circle).
- `!jokes` - Fetches a random joke.

### 💰 Economy
- `!money` - Check your money balance.
- `!balance <@user> <type> <add/remove> <amount>` - Manage user balances.
- `!setup` - Configure the server's economy system.

### 🔊 Music
- `!play youtube <video>` - Play a YouTube video.
- `!play spotify` - Play a song from your Spotify status.
- `!skip` - Skips the current song.
- `!stop` - Stops music playback.

### 📋 Information
- `!info` - Displays bot stats like memory usage, CPU, and uptime.
- `!profile [@user]` - Displays user information and badges.
- `!gamestatus <game> <IP> <port>` - Fetches the status of a game server.

### ✨ Customization
- `!badge <@user> <badge>` - Assign custom badges to users.
- `!poll <text> [options]` - Create a poll with multiple options.

### 📈 Server Utilities
- `!invites [@user]` - Check invite stats for a user.
- `!ping` - Checks the bot's response time.

---

## 📂 Folder Structure

```plaintext
src/
├── base/           # Core classes like Command and Client
├── commands/       # Command implementations
├── events/         # Event listeners
├── utils/          # Utility functions (e.g., permissions, date formatting)
├── config.ts       # Bot configuration file
└── index.ts        # Main entry point of the application
```

---

## ✨ Future Features

- **Leveling System**: Gamify server activity with XP and levels.
- **Advanced Music Controls**: Playlists, volume control, and shuffle support.
- **Reaction Roles**: Allow users to self-assign roles using reactions.
- **Custom Command System**: Admins can create their own bot commands.
- **Leaderboard**: Displays the top users by activity or wealth.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## ❤️ Acknowledgments

- Thanks to the Discord.js community for guidance.
- Special thanks to OpenAI for GPT integration inspiration.
