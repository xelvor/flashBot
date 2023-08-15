import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import axios from 'axios';
import { splitNum } from '../utils/numbers/main';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'clear',
            description: 'Clear messages',
            owner: false,
            options: [
                {
                    name: 'count',
                    description: 'Enter a count of messages',
                    type: 10,
                    required: true
                }
            ],
            run: async (interaction: any) => {
                // for (let i = 0; i < 500; i++) {
                //     interaction.channel.send('message' + i)
                // }

                const count = interaction.options.getNumber('count')
                if (count > 100) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('Confirmation required')
                    .setColor(config.color as HexColorString)
                    .setDescription(`Are you sure you want to delete \`${count}\` messages?`)
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

                    await interaction.reply({embeds: [embed], components:[button], ephemeral: true})

                    const collector = interaction.channel.createMessageComponentCollector({
                        filter: (i) => i.user.id === interaction.member.user.id,
                        time: 60000
                    });

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
                            await int.update({ embeds: [embed], components: [] })
                        } else if (int.customId == 'yes') {
                            const operations = splitNum(count, 100);

                            let embed: EmbedBuilder = new EmbedBuilder()
                            .setTitle('Removal in progress..')
                            .setColor(config.color as HexColorString)
                            .setDescription(`\`${count}\` message has been requested to be deleted. The operation will be broken down into smaller parts to get around Discord's API limits.\nParts: \`${operations.join(', ')}\``)
                            .setFooter({
                                text: interaction.member.user.username,
                                iconURL: interaction.member.user.avatarURL()
                            })
                            .setTimestamp()
                            await int.update({ embeds: [embed], components: []})

                            let deletedCount = 0;
                            for (const i in operations) {
                                const number = operations[i];
                                embed.setTitle(`[${+i + 1}/${operations.length}] Removal in progress..`)
                                int.editReply({ embeds: [embed], components: []})
                                const numDeleted = await interaction.channel.bulkDelete(number, true);
                                deletedCount += numDeleted.size;
                                if (numDeleted.size == 0) {
                                    embed.setTitle(`[${operations.length}/${operations.length}] Deletion complete.`)
                                    int.editReply({ embeds: [embed], components: []})

                                    const embed2: EmbedBuilder = new EmbedBuilder()
                                    .setTitle('<a:tak:1043874690634096681> Success')
                                    .setColor(config.color as HexColorString)
                                    .setDescription(`Deleted: \`${deletedCount} messages\``)
                                    .setFooter({
                                        text: interaction.member.user.username,
                                        iconURL: interaction.member.user.avatarURL()
                                    })
                                    .addFields(
                                        {
                                            name: "<:user:1139222572295274657> User",
                                            value: `<@${interaction.member.user.id}>`
                                        },
                                        {
                                            name: "<:cpu:1140390874732306584> Count",
                                            value: `\`${count}\``
                                        }
                                    )
                                    .setTimestamp()
                                    return await interaction.channel.send({embeds: [embed2]})
                                }

                                if (+i+1 == operations.length) {
                                    embed.setTitle(`[${+i + 1}/${operations.length}] Deletion complete.`)
                                    int.editReply({ embeds: [embed], components: []})

                                    const embed2: EmbedBuilder = new EmbedBuilder()
                                    .setTitle('<a:tak:1043874690634096681> Success')
                                    .setColor(config.color as HexColorString)
                                    .setDescription(`Deleted: \`${deletedCount} messages\``)
                                    .setFooter({
                                        text: interaction.member.user.username,
                                        iconURL: interaction.member.user.avatarURL()
                                    })
                                    .addFields(
                                        {
                                            name: "<:user:1139222572295274657> User",
                                            value: `<@${interaction.member.user.id}>`
                                        },
                                        {
                                            name: "<:cpu:1140390874732306584> Count",
                                            value: `\`${count}\``
                                        }
                                    )
                                    .setTimestamp()
                                    return await interaction.channel.send({embeds: [embed2]})
                                }
                            }
                        }
                    })
                } else {
                    interaction.channel.bulkDelete(count)
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:tak:1043874690634096681> Success')
                    .setDescription(`Successfully deleted \`${count} messages\``)
                    .addFields(
                        {
                            name: "<:user:1139222572295274657> User",
                            value: `<@${interaction.member.user.id}>`
                        },
                        {
                            name: "<:tag:1139222570542059582> Count",
                            value: `\`${count}\``
                        }
                    )
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp()

                    await interaction.channel.send({embeds: [embed]})
                }
            }
        })
    }
}