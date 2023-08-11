import Event from '../base/Event';
import { Client } from 'discord.js';
import { setPresence } from '../utils/activity/main';
import { registerCommands } from '../base/Client';
import { User } from '../utils/models/user';


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

                const users = client.guilds.cache.get('1122947672765112361').members.cache
                let loaded = []

                users.forEach(async x => {
                    User.find({ id: x.id }).then(data => {
                        if (data['id']) {
                            loaded.push({
                                id: data['id']
                            })
                        } else {
                            const user = new User({
                                username: x.user.username,
                                tag: x.user.discriminator,
                                id: x.user.id,
                                money: 0,
                                bank_money: 0,
                                badges: [],
                                invites: []
                            })
            
                            user.save()
                        }
                    })
                })

                console.log(`Loaded ${loaded.length} users of ${client.users.cache.size}`)
            }
        })
    }
}