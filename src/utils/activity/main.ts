import { Client } from "discord.js";
import { ActivityType } from "discord.js";

export function setPresence(client: Client) {
    const users: Number = client.users.cache.size
    const servers: Number = client.guilds.cache.size

    client.user.setPresence({
        activities: [{ name: `👋 Users: ${users} 🖥️ Servers: ${servers}`, type: ActivityType.Watching }]
    });
}