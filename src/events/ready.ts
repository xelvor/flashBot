import Event from '../base/Event';
import { Client, ActivityType } from 'discord.js';
export default class ready extends Event {
    constructor() {
        super({
            name: 'ready',
            run: async (client: Client) => {
                console.log(`Logged as ${client.user.tag}`)

                client.user.setPresence({
                    activities: [{ name: `🖥️ `, type: ActivityType.Watching }]
                });
            }
        })
    }
}