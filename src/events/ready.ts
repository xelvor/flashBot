import Event from '../base/Event';
import { Client, EmbedBuilder } from 'discord.js';
import { setPresence } from '../utils/activity/main';
import { registerCommands } from '../base/Client';
import { User } from '../utils/models/user';
import { newUser } from '../utils/users/main';
import { getEmbedColor } from '../utils/colors/main';
import axios from 'axios';
import { toTimestamp } from '../utils/date/main';


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

                const users = client.users.cache

                users.forEach(x => {
                    User.find({ id: x.id }).then(async data => {
                        if (!data[0]) {
                            newUser(x.username, x.id, x.discriminator, 0, 0, [])
                            console.log(`[Users] Created new account: ${x.username}#${x.discriminator}`)
                            
                            const userData = await axios.get(`https://japi.rest/discord/v1/user/${x.id}`)
                            const data = userData.data.data

                            let nitro = data.public_flags_array.find((obj) => {
                                return obj === 'NITRO';
                            });

                            let badges = []

                            data.public_flags_array.map(x => {
                                if (x == 'NITRO') {
                                    badges.push({
                                        icon: '<:nitro:1139240003050934407>',
                                        name: 'Discord nitro'
                                    })
                                } else if (x == 'ACTIVE_DEVELOPER') {
                                    badges.push({
                                        icon: '<:developer:1139239941482741850>',
                                        name: 'Active Developer'
                                    })
                                } else if (x == 'HOUSE_BALANCE') {
                                    badges.push({
                                        icon: '<:1_:1139239945119211590>',
                                        name: 'House Balance'
                                    })
                                }
                            })
                            
                            if (nitro) {
                                nitro = 'Yes'
                            } else {
                                nitro = 'No'
                            }

                            let badgesText: string;

                            if (badges.length > 0) {
                                badgesText = badges.map(x => `${x.icon} \`- ${x.name}\``).join('\n')
                            } else {
                                badgesText = '\`None\`'
                            }

                            const embed = new EmbedBuilder()
                            .setTitle('MongoDB New user')
                            .addFields(
                                {
                                    name: "<:user:1139222572295274657> Username",
                                    value: `\`${x.username}\``
                                },
                                {
                                    name: "<:tag:1139222570542059582> Tag",
                                    value: `\`${x.discriminator}\``
                                },
                                {
                                    name: "<:avatar:1139223731038855179> Avatar",
                                    value: `[Link](${x.displayAvatarURL()})`
                                },
                                {
                                    name: "<:avatar:1139223731038855179> Account created",
                                    value: `<t:${toTimestamp(x.createdAt)}:R>`
                                },
                                {
                                    name: "<:nitro:1139240003050934407> Nitro",
                                    value: `\`${nitro}\``
                                },
                                {
                                    name: "<:badges:1139228708989841458> Badges",
                                    value: badgesText
                                }
                            )
                            //@ts-ignore
                            .setColor(getEmbedColor())
                            .setFooter({
                                text: x.username,
                                iconURL: x.displayAvatarURL()
                            })
                            .setTimestamp()
                            //@ts-ignore
                            client.channels.cache.get('1139443223371190354').send({ embeds: [embed] })
                        }
                    })
                })
            }
        })
    }
}