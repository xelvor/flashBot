import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildChannel, HexColorString, PermissionFlagsBits } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'nuke',
            description: 'Nuke',
            owner: false,
            options: [
                {
                    name: 'channel',
                    description: 'Choose a channel',
                    type: 7,
                    required: false
                }
            ],
            run: async (interaction: any) => {
                const channel = interaction.options.getChannel('channel') || interaction.channel

                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setDescription(`You don't have permission`)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.reply({ embeds: [embed] })
                }

                const embed2: EmbedBuilder = new EmbedBuilder()
                .setTitle('Confirmation required')
                .setColor(config.color as HexColorString)
                .setDescription(`Are you sure you want to nuke this channel?`)
                .addFields(
                    { name: '<:cpu:1140390874732306584> Channel', value: `${channel}` }
                )
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Secondary)
                )

                await interaction.reply({embeds: [embed2], components:[button], ephemeral: true})

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (i) => i.user.id === interaction.member.user.id,
                    time: 60000
                })

                collector.on('collect', async (int) => {
                    if (int.customId == 'no') {
                        const embed: EmbedBuilder = new EmbedBuilder()
                        .setTitle('Canceled')
                        .setColor(config.color as HexColorString)
                        .setDescription(`Message deletion has been cancelled.`)
                        .setFooter({
                            text: interaction.member.user.username,
                            iconURL: interaction.member.user.avatarURL()
                        })
                        .setTimestamp()
                        await interaction.editReply({embeds: [embed], ephemeral: true, components: []})
                        collector.stop()
                    } else if (int.customId == 'yes') {
                        const newChannel: GuildChannel = await channel.clone()
                        newChannel.setPosition(channel.position)
                        channel.delete()
                        const embed: EmbedBuilder = new EmbedBuilder()
                        .setTitle('Nuked')
                        .setColor(config.color as HexColorString)
                        .setDescription(`Channel nuked.`)
                        .addFields(
                            { name: '<:user:1139222572295274657> Moderator', value: `<@${interaction.member.user.id}>` },
                            { name: '<:cpu:1140390874732306584> Channel', value: `${newChannel}` }
                        )
                        .setFooter({
                            text: interaction.member.user.username,
                            iconURL: interaction.member.user.avatarURL()
                        })
                        .setTimestamp()
                        //@ts-ignore
                        await newChannel.send({ embeds: [embed] })
                        collector.stop()
                    }
                })
            }
        })
    }
}