import Event from '../base/Event';
import { Client } from 'discord.js';
import { setPresence } from '../utils/activity/main';
import { registerCommands } from '../base/Client';


export default class ready extends Event {
    constructor() {
        super({
            name: 'ready',
            run: async (client: Client) => {
                console.log(`Logged as ${client.user.tag}`)
                setPresence(client)
                setInterval(setPresence, 50000, client)

                const guilds = client.guilds.cache
                guilds.forEach(async guild => {
                    await registerCommands(guild.id)
                })
            }
        })
    }
}