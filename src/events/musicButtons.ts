import { EmbedBuilder, ButtonInteraction, HexColorString, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Event from '../base/Event';
import { music } from '..';
import { config } from '../config';
import { exportInteraction, nextQueue } from '../commands/play';
import lyricsFinder from 'lyrics-finder'

export default class musicButtons extends Event {
    constructor() {
        super({
            name: 'interactionCreate',
            run: async (interaction: ButtonInteraction) => { 
                if (!interaction.isButton()) return;
                const connection = music[interaction.guild.id].connection
                if (!connection) return;

                if (interaction.customId == 'stop') {
                    connection.disconnect();
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle(music[interaction.guild.id][0].title)
                    .setDescription('Music has been stopped')
                    .setColor(config.color as HexColorString)
                    .setFooter({
                        text: interaction.member.user.username,
                        //@ts-ignore
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp()
                    await exportInteraction.editReply({ embeds: [embed], components: [] })
                    music[interaction.guild.id].shift()
                } else if (interaction.customId == 'skip') {
                    interaction.reply('xdd')
                } else if (interaction.customId == 'lyrics') {
                    console.log(await lyricsFinder(music[interaction.guild.id][0].title))
                    // const embed: EmbedBuilder = new EmbedBuilder()
                    // .setTitle(`${music[interaction.guild.id][0].title} Lyrics`)
                    // .setDescription(text.lyrics)
                    // .setColor(config.color as HexColorString)
                    // .setFooter({
                    //     text: interaction.member.user.username,
                    //     //@ts-ignore
                    //     iconURL: interaction.member.user.avatarURL()
                    // })
                    // .setTimestamp()
                    // const button = new ActionRowBuilder()
                    // .addComponents(
                    //     new ButtonBuilder()
                    //     .setURL(text.source.link)
                    //     .setLabel(text.source.name)
                    //     .setStyle(ButtonStyle.Link)
                    // )
                    // //@ts-ignore
                    // await interaction.reply({ embeds: [embed], components: [button] })
                }
            }
        })
    }
}