import { BaseInteraction, EmbedBuilder, HexColorString, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import Event from '../base/Event';
import { config } from '../config';
import { Guild } from '../utils/models/guild';
import { client } from '../base/Client';

export default class selectMenu extends Event {
    constructor() {
        super({
            name: 'interactionCreate',
            run: async (interaction: BaseInteraction) => {
                if (!interaction.isStringSelectMenu()) return;

                if (interaction.values[0] === 'invitelogger') {
                    const channels = interaction.guild.channels.cache;
                    const textChannels = channels.filter(channel => channel.type === ChannelType.GuildText);
                    const options = textChannels.map(channel => ({
                        label: channel.name,
                        value: channel.id
                    }));
    
                    const component = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('selectChannel')
                                .setPlaceholder('Choose a channel!')
                                .addOptions(options)
                        );
    
                    const embed = new EmbedBuilder()
                        .setTitle('Choose a channel')
                        .setColor(config.color as HexColorString)
                        .setFooter({
                            text: interaction.member.user.username,
                            //@ts-ignore
                            iconURL: interaction.member.user.avatarURL()
                        })
                        .setTimestamp();
                        //@ts-ignore
                    await interaction.reply({embeds: [embed], ephemeral: true, components: [component]});

                    const collector = interaction.channel.createMessageComponentCollector({
                        filter: (i) => i.user.id === interaction.member.user.id,
                        time: 60000
                    });

                    collector.on('collect', async (i: any) => {
                        const id = i.values[0]
        
                        const embed = new EmbedBuilder()
                            .setTitle('Set message')
                            .setDescription(`
                            Example: \`{username} joined for the server, invited by: {inviter} he have {invites} invites\`
                            Format: \`{username}, {invites}, {inviter}\`
                            
                            Send message on the this channel
                            `)
                            .setColor(config.color as HexColorString)
                            .setFooter({
                                text: interaction.member.user.username,
                                //@ts-ignore
                                iconURL: interaction.member.user.avatarURL()
                            })
                            .setTimestamp();
                            //@ts-ignore

                        await i.update({embeds: [embed], ephemeral: true, components: []});
                        

                        const messageCollector = interaction.channel.createMessageCollector({
                            time: 60000,
                            filter: (i) => i.member.id == interaction.member.user.id,
                            max: 1
                        });

                        messageCollector.on('collect', async message => {
                            const embed = new EmbedBuilder()
                            .setColor(config.color as HexColorString)
                            .setTitle('<a:tak:1043874690634096681> Success')
                            .setDescription(`Succesly updated module: \`Invite Logger\`\n<:user:1139222572295274657> User: ${interaction.member.user}\n<:tag:1139222570542059582> Channel: ${client.channels.cache.get(id)}\n<:created:1140386863023149218> Message: \`${message.content}\`\n\n||Sended test message||`)
                            .setFooter({
                                text: interaction.member.user.username,
                                //@ts-ignore
                                iconURL: interaction.member.user.avatarURL()
                            })
                            .setTimestamp();

                            await message.reply({ embeds: [embed], content: `<@${message.author.id}>` })

                            Guild.findOne({ id: interaction.guild.id }).then(async x => {
                                const serverData = x.data
                                serverData.forEach(async data => {
                                    //@ts-ignore
                                    if (data.type == 'invite-logger') {
                                        //@ts-ignore
                                        data.text = message.content
                                        //@ts-ignore
                                        data.channelID = id
                                    } else {
                                        serverData.push({
                                            text: message.content,
                                            type: 'invite-logger',
                                            channelID: id
                                        })
                                    }

                                    x.markModified('data');
                                    await x.save();

                                    //@ts-ignore
                                    client.emit('guildMemberAdd', interaction.member)

                                    collector.stop()
                                    messageCollector.stop()
                                })
                            })
                        })
                    })
                } else if (interaction.values[0] == 'antyinvite') {
                    const channels = interaction.guild.roles.cache
                    const options = channels.map(channel => ({
                        label: channel.name,
                        value: channel.id
                    }));
    
                    const component = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('selectChannel')
                                .setPlaceholder('Choose a rank!')
                                .addOptions(options)
                        );
    
                    const embed = new EmbedBuilder()
                        .setTitle('Punish')
                        .setColor(config.color as HexColorString)
                        .setFooter({
                            text: interaction.member.user.username,
                            //@ts-ignore
                            iconURL: interaction.member.user.avatarURL()
                        })
                        .setTimestamp();
                        //@ts-ignore
                    await interaction.reply({embeds: [embed], ephemeral: true, components: [component]});

                    const collector = interaction.channel.createMessageComponentCollector({
                        filter: (i) => i.user.id === interaction.member.user.id,
                        time: 60000
                    });

                    collector.on('collect', async (i: any) => {
                        const id = i.values[0]
                        const component = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('selectPunish')
                                .setPlaceholder('Choose a punish!')
                                .addOptions({
                                    label: "Kick",
                                    value: "kick"
                                },
                                {
                                    label: "Mute",
                                    value: "mute"
                                },
                                {
                                    label: "Ban",
                                    value: "ban"
                                })
                        );
                        await i.update({embeds: [embed], ephemeral: true, components: [component]});

                        const collector2 = interaction.channel.createMessageComponentCollector({
                            filter: (i) => i.user.id === interaction.member.user.id,
                            time: 60000
                        });

                        collector2.on('collect', async (i2: any) => {

                            Guild.findOne({ id: interaction.guild.id }).then(async x => {
                                const serverData: Array<object> = x.data
                                if (serverData.length > 0) {
                                    console.log('jest')
                                } else {
                                    serverData.push({
                                        type: 'anty-invite',
                                        ignore: [
                                            {
                                                rank: id
                                            }
                                        ]
                                    })

                                    x.markModified('data')
                                    await x.save()
                                    await i2.update({
                                        content: "Updated",
                                        embeds: [],
                                        components: []
                                    })
                                    await collector2.stop()
                                    await collector.stop()
                                }
                            })
                            // Guild.findOne({ id: interaction.guild.id }).then(async x => {
                            //     const serverData = x.data
                            //     if (serverData.length > 0) {
                            //         serverData.forEach(async data => {
                            //             //@ts-ignore
                            //             if (data.type == 'anty-invite') {
                            //                 //@ts-ignore
                            //                 data.punish = i2.values[0]
                            //                  //@ts-ignore
                            //                 data.ignore.push({
                            //                     rank: id
                            //                 })
                            //             } else {
                            //                 serverData.push({
                            //                     type: 'anty-invite',
                            //                     ignore: [
                            //                         {
                            //                             rank: id
                            //                         }
                            //                     ]
                            //                 })
                            //             }
    
                            //             x.markModified('data');
                            //             await x.save();
    
                            //             collector2.stop()
                            //             const embed = new EmbedBuilder()
                            //             .setColor(config.color as HexColorString)
                            //             .setTitle('<a:tak:1043874690634096681> Success')
                            //             .setDescription(`Succesly updated module: \`Anty-Invite\`\n<:user:1139222572295274657> User: ${interaction.member.user}\n<:tag:1139222570542059582> Channel: ${client.channels.cache.get(id)}\n<:created:1140386863023149218> Punish: \`${i2.values[0]}`)
                            //             .setFooter({
                            //                 text: interaction.member.user.username,
                            //                 //@ts-ignore
                            //                 iconURL: interaction.member.user.avatarURL()
                            //             })
                            //             .setTimestamp();
            
                            //             await i.update({ embeds: [embed]}) 
                            //         })
                            //     } else {
    
                            //         x.markModified('data');
                            //         await x.save();

                            //         collector2.stop()
                            //         const embed = new EmbedBuilder()
                            //         .setColor(config.color as HexColorString)
                            //         .setTitle('<a:tak:1043874690634096681> Success')
                            //         .setDescription(`Succesly updated module: \`Anty-Invite\`\n<:user:1139222572295274657> User: ${interaction.member.user}\n<:tag:1139222570542059582> Channel: ${client.channels.cache.get(id)}\n<:created:1140386863023149218> Punish: \`${i2.values[0]}`)
                            //         .setFooter({
                            //             text: interaction.member.user.username,
                            //             //@ts-ignore
                            //             iconURL: interaction.member.user.avatarURL()
                            //         })
                            //         .setTimestamp();
        
                            //         await i.delete({ embeds: [embed]}) 
                            //     }
                            // })
                        })
                    })
                }
            }
        })
    }
}
