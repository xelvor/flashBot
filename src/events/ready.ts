import Event from '../base/Event';
import { Client, ActivityType } from 'discord.js';
import { query } from 'gamedig'

export default class ready extends Event {
    constructor() {
        super({
            name: 'ready',
            run: async (client: Client) => {
                console.log(`Logged as ${client.user.tag}`)

                query({ type: "mtasa", host: '137.74.7.181', port: 22110 }).then((state) => {
                    client.user.setPresence({
                        activities: [{ name: `${state.players.length}/1000`, type: ActivityType.Watching }]
                    });
                });     
                setInterval(() => {
                    query({ type: "mtasa", host: '137.74.7.181', port: 22110 }).then((state) => {
                        client.user.setPresence({
                            activities: [{ name: `${state.players.length}/1000`, type: ActivityType.Watching }]
                        });
                    });            
                }, 60000);
            }
        })
    }
}