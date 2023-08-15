import { EmbedBuilder, HexColorString, ActionRowBuilder, ButtonStyle, ButtonBuilder, BaseInteraction } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import { query } from 'gamedig'
import { client } from '../base/Client';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'gamestatus',
            description: 'Show info of the game server',
            owner: false,
            options: [
                {
                    name: 'game',
                    description: 'Choose a game',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "MultiTheftAuto",
                            value: "mtasa"
                        }
                    ]
                },
                {
                    name: 'ip',
                    description: 'Enter ip',
                    type: 3,
                    required: true
                },
                {
                    name: 'port',
                    description: 'Enter port',
                    type: 10,
                    required: true
                }
            ],
            run: async (interaction: any) => {
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })


                const value = interaction.options.getString('game')
                const ip = interaction.options.getString('ip')
                const port = interaction.options.getNumber('port')

                try {
                    const data = await query({ type: value, host: ip, port: port })

                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle(`${data.name}`)
                    .addFields(
                        {
                            name: "<:user:1139222572295274657> Server name",
                            value: `\`${data.name}\``,
                            // inline: true
                        },
                        {
                            name: "<:cpu:1140390874732306584> IP",
                            value: `\`${ip}\``,
                            // inline: true
                        },
                        {
                            name: "<:version:1140391577206923425> Port",
                            value: `\`${port}\``,
                            // inline: true
                        },
                        {
                            name: "<:user:1139222572295274657> Players",
                            value: `\`${data.raw.numplayers}\``,
                            // inline: true
                        },
                        {
                            name: "<:created:1140386863023149218> Gamemode",
                            value: `\`${data.raw.gamename}\``,
                            // inline: true
                        },
                        {
                            name: "<:tag:1139222570542059582> Gametype",
                            value: `\`${data.raw.gametype}\``,
                            // inline: true
                        },
                        {
                            name: "<:user:1139222572295274657> Max players",
                            value: `\`${data.maxplayers}\``,
                            // inline: true
                        },
                        {
                            name: "<:version:1140391577206923425> Ping",
                            value: `\`${data.ping}\``,
                            // inline: true
                        },
                    )
                    .setColor(config.color as HexColorString)
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp()
                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('players-list')
                        .setLabel('Players list')
                        .setStyle(ButtonStyle.Primary)
                    )
                    interaction.editReply({embeds: [embed],components: [button]})

                    let page = 1
                    let pageStart = 10 * (page - 1);
                    let pageEnd = 10 * page;
                    const players = data.players.slice(pageStart, pageEnd).map((x, i) => {
                        return `\`${x.name} - ${x.raw.ping}ms\``
                    });

                    client.on('interactionCreate', async (inter: BaseInteraction) => {
                        if (!inter.isButton()) return;
                        if (inter.customId == 'players-list') {
                            const embed = new EmbedBuilder()
                            .setTitle('Players list')
                            .setColor(config.color as HexColorString)
                            .setDescription(`${players.join('\n')}\n\nPage: \`${page}/${Math.floor((data.players.length/10) + 1)}\``)
                            .setFooter({
                                text: interaction.member.user.username,
                                iconURL: interaction.member.user.avatarURL()
                            })
                            .setTimestamp()
                            const button = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                   .setCustomId("before")
                                   .setLabel("Previous page")
                                   .setStyle(ButtonStyle.Success)
                                   .setDisabled(true),
                            )
                            .addComponents(
                                 new ButtonBuilder()
                                    .setCustomId("next")
                                    .setLabel("Next page")
                                    .setStyle(ButtonStyle.Success),
                             );
                            //@ts-ignore
                            await inter.reply({embeds: [embed], ephemeral: true, components: [button]})

                            const collector = interaction.channel.createMessageComponentCollector({
                                filter: (i) => i.user.id === interaction.member.user.id,
                                time: 60000
                            });

                            collector.on('collect', async (i: any) => {
                                if (i.customId === 'next') {
                                    let button: ActionRowBuilder;
                                    if (page === Math.floor((data.length/10))) {
                                        button = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                               .setCustomId("before")
                                               .setLabel("Previous page")
                                               .setStyle(ButtonStyle.Success),
                                        )
                                        .addComponents(
                                             new ButtonBuilder()
                                                .setCustomId("next")
                                                .setLabel("Next page")
                                                .setStyle(ButtonStyle.Success)
                                                .setDisabled(true)
                                         );
                                    } else {
                                        button = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                               .setCustomId("before")
                                               .setLabel("Previous page")
                                               .setStyle(ButtonStyle.Success),
                                        )
                                        .addComponents(
                                             new ButtonBuilder()
                                                .setCustomId("next")
                                                .setLabel("Next page")
                                                .setStyle(ButtonStyle.Success)
                                         );
                                    }

                                    page ++
                                    pageStart = 10 * (page - 1);
                                    pageEnd = 10 * page;

                                    const players = data.players.slice(pageStart, pageEnd).map((x, i) => {
                                        return `\`${x.name} - ${x.raw.ping}ms\``
                                    });

                                    const embed = new EmbedBuilder()
                                    .setTitle('Players list')
                                    .setColor(config.color as HexColorString)
                                    .setDescription(`${players.join('\n')}\n\nPage: \`${page}/${Math.floor((data.players.length/10) + 1)}\``)
                                    .setFooter({
                                        text: interaction.member.user.username,
                                        iconURL: interaction.member.user.avatarURL()
                                    })
                                    .setTimestamp()

                                    //@ts-ignore
                                    try {
                                        await i.update({embeds: [embed], ephemeral: true, components: [button]})
                                    } catch(e) {
                                        console.log(e)
                                        await interaction.reply('Error')
                                    }
                                } else if (i.customId == 'before') {

                                    let button: ActionRowBuilder;
                                    if (page === 2) {
                                        button = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                               .setCustomId("before")
                                               .setLabel("Previous page")
                                               .setStyle(ButtonStyle.Success)
                                               .setDisabled(true),
                                        )
                                        .addComponents(
                                             new ButtonBuilder()
                                                .setCustomId("next")
                                                .setLabel("Next page")
                                                .setStyle(ButtonStyle.Success)
                                         );
                                    } else {
                                        button = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                               .setCustomId("before")
                                               .setLabel("Previous page")
                                               .setStyle(ButtonStyle.Success),
                                        )
                                        .addComponents(
                                             new ButtonBuilder()
                                                .setCustomId("next")
                                                .setLabel("Next page")
                                                .setStyle(ButtonStyle.Success)
                                         );
                                    }
                                    page --
                                    pageStart = 10 * (page - 1);
                                    pageEnd = 10 * page;
                                    
                                   const players = data.players.slice(pageStart, pageEnd).map((x, i) => {
                                       return `\`${x.name} - ${x.raw.ping}ms\``
                                   });

                                   const embed = new EmbedBuilder()
                                   .setTitle('Players list')
                                   .setColor(config.color as HexColorString)
                                   .setDescription(`${players.join('\n')}\n\nPage: \`${page}/${Math.floor((data.players.length/10) + 1)}\``)
                                   .setFooter({
                                       text: interaction.member.user.username,
                                       iconURL: interaction.member.user.avatarURL()
                                   })
                                   .setTimestamp()

                                   //@ts-ignore
                                   try {
                                    await i.update({embeds: [embed], ephemeral: true, components: [button]})
                                } catch(e) {
                                    console.log(e)
                                    await interaction.reply('Error')
                                }
        
                                }
                            })
                        }
                    })
                } catch (e) {
                    console.log(e)
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setDescription(`I'm sorry, but I'm currently unable to fetch information about the game server's status. This could be due to technical issues or the server's unavailability. Please try again later or reach out to the game server's administration for more information.`)
                    .addFields(
                        {
                            name: "<:cpu:1140390874732306584> IP",
                            value: `\`${ip}\``
                        },
                        {
                            name: "<:version:1140391577206923425> Type",
                            value: `\`${value}\``
                        },
                        {
                            name: "<:created:1140386863023149218> Port",
                            value: `\`${port}\``
                        }
                    )
                    .setColor('Red')
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp()
                    await interaction.editReply({embeds: [embed]})
                }
            }
        })
    }
}