import { BaseInteraction, EmbedBuilder, HexColorString, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import Event from '../base/Event';
import { config } from '../config';
import { Guild } from '../utils/models/guild';

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
                            Example: \`{username joined for the server, have {invites} invites}\`
                            Format: \`{username}, {invites}\`
                            
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
                            .setDescription(`Succesly updated module: \`Invite Logger\`\n<:user:1139222572295274657> User: ${interaction.member.user}\n<:tag:1139222570542059582> Channel: ${interaction.channel}\n<:created:1140386863023149218> Message: \`${message.content}\`\n\n||Sended test message||`)
                            .setFooter({
                                text: interaction.member.user.username,
                                //@ts-ignore
                                iconURL: interaction.member.user.avatarURL()
                            })
                            .setTimestamp();

                            await message.reply({ embeds: [embed], content: `<@${message.author.id}>` })

                            Guild.findOne({ id: interaction.guild.id }).then(x => {
                                const serverData = x.data
                                serverData.push({
                                    text: message.content,
                                    type: 'invite-logger',
                                    channelID: interaction.channel.id
                                })

                                x.save()
                            })
                        })
                    })
                }
            }
        })
    }
}
