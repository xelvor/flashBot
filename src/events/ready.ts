import Event from '../base/Event';
import { ChannelType, Client, EmbedBuilder, TextChannel } from 'discord.js';
import { setPresence } from '../utils/activity/main';
import { client, registerCommands } from '../base/Client';
import { User } from '../utils/models/user';
import { newUser } from '../utils/users/main';
import { getEmbedColor } from '../utils/colors/main';
import axios from 'axios';
import { toTimestamp } from '../utils/date/main';
import { commands } from '..';
import { InviteM } from '../utils/models/invite';
import { newInvite } from '../utils/invites/main';
import { Guild } from '../utils/models/guild';
import { newGuild } from '../utils/guilds/main';


export default class ready extends Event {
    constructor() {
        super({
            name: 'ready',
            run: async () => {
                console.log(`Logged as ${client.user.tag}`)
                setPresence(client)
                setInterval(setPresence, 50000, client)
                const guilds = client.guilds.cache
                guilds.forEach(async guild => {
                    await registerCommands(commands, guild.id)
 
                    try {
                        const data = await Guild.findOne({ id: guild.id })
                        if (data == null) {
                            const owner = await guild.fetchOwner();
                            const channels = guild.channels.cache;
                            let savedChannels = [];
                            
                            channels.forEach(channel => {
                                if (channel.type == ChannelType.GuildText) {
                                    savedChannels.push({
                                        name: channel.name,
                                        id: channel.id
                                    });
                                }
                            });
                            
                            if (savedChannels.length > 0) {
                                const firstChannel = savedChannels[0];
                                const channelID = firstChannel.id;
                                //@ts-ignore
                                const serverInvite = await channels.get(channelID).createInvite();
                            
                                newGuild(guild.id, guild.name, [], owner.id, serverInvite)
                            } else {
                                console.log('No text channels found in the guild.');
                            }
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                    InviteM.findOne({ guild: guild.id }).then(async data => {
                        if (!data) {
                            const invites = await guild.invites.fetch()
                            invites.forEach(x => {
                                InviteM.findOne({ code: x.code }).then(async inviteData => {
                                    if (!inviteData) {
                                        newInvite(x.inviterId, 0, 0, 0, x.uses, x.code, x.guild.id, [])
                                    }
                                })
                            })
                        }
                    })
                })

                const users = client.guilds.cache.get('1122947672765112361').members.cache
                
                try {
                    guilds.forEach(async guild => {
                        const channels = await  guild.channels.fetch()
                        channels.forEach(async channel => {
                            if (channel.type == ChannelType.GuildText) {
                                const textChannel = channel as TextChannel;
                                const messages = await textChannel.messages.fetch();
                                messages.forEach(async message => {
                                    if (message.embeds.length > 0) {
                                        const embed = message.embeds[0]
                                        if (embed) {
                                            if (embed.description?.includes('Started playing music')) {
                                                const newEmbed = new EmbedBuilder()
                                                .setDescription('\`Bot has been restarted\`')
                                                .setTitle(embed.title)
                                                .setColor(embed.color)
                                                .setTimestamp(toTimestamp(embed.timestamp))
                                                // .setImage(embed.image.url)
                                                await message.edit({ embeds: [newEmbed], components: [] })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    })
                  } catch (error) {
                    console.error('Error:', error);
                  }
                

                users.forEach(x => {
                    User.find({ id: x.id }).then(async data => {
                        if (!data[0]) {
                            newUser(x.user.username, x.id, x.user.discriminator, 0, 0, [])
                            console.log(`[Users] Created new account: ${x.user.username}#${x.user.discriminator}`)
                            
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
                                    value: `\`${x.user.username}\``
                                },
                                {
                                    name: "<:tag:1139222570542059582> Tag",
                                    value: `\`${x.user.discriminator}\``
                                },
                                {
                                    name: "<:avatar:1139223731038855179> Avatar",
                                    value: `[Link](${x.user.displayAvatarURL()})`
                                },
                                {
                                    name: "<:avatar:1139223731038855179> Account created",
                                    value: `<t:${toTimestamp(x.user.createdAt)}:R>`
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
                                text: x.user.username,
                                iconURL: x.displayAvatarURL()
                            })
                            .setTimestamp()
                            //@ts-ignore
                            client.channels.cache.get('1142553350836068362').send({ embeds: [embed] })
                        }
                    })
                })
            }
        })
    }
}