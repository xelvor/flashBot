import { EmbedBuilder, ButtonInteraction, HexColorString, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Event from '../base/Event';
import { music } from '..';
import { config } from '../config';
import { exportInteraction, nextQueue } from '../commands/play';
import { getLyrics, getSong } from 'genius-lyrics-api';

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
                    const musicData = music[interaction.guild.id]?.[0]; 
                    if (musicData) {
                        const title = musicData.title;
                        const separatorIndex = title.indexOf('-'); 
                        
                        if (separatorIndex !== -1) { 
                            const trimmedTitle = title.substring(0, separatorIndex).trim(); 
                            const artist = title.substring(separatorIndex + 1).trim(); 
                            
                            const options = {
                                apiKey: '4tj86koeAYnCydnAvCFI8JrrMKwKNfmOXkLGdSQ2d4-gRn9WqayZGsh3yEEsd8er',
                                title: trimmedTitle,
                                artist: artist, 
                                optimizeQuery: true
                            };
                            
                            getSong(options).then((song) => {  
                                //const maxChars = 1999;
                                //const lyrics = song.lyrics;
                                //
                                //let lyricsToSend = lyrics;
                                //if (lyrics.length > maxChars) {
                                //    lyricsToSend = lyrics.substring(0, maxChars);
                                //}
                                console.log(song)
                                const embed: EmbedBuilder = new EmbedBuilder()
                                    .setTitle(`<:musical:1141482466050314310> ${trimmedTitle} - ${artist}`)
                                    .setDescription(`\`${song.lyrics}\``)
                                    .addFields(
                                        {
                                            name: '<:link:1139222567933190247> Link to lirycs',
                                            value: `\`${song.url}\``
                                        }
                                    )
                                    .setColor(config.color as HexColorString)
                                    .setFooter({
                                        text: interaction.member.user.username,
                                        //@ts-ignore
                                        iconURL: interaction.member.user.avatarURL()
                                    })
                                    .setTimestamp()
                            
                                interaction.reply({ embeds: [embed] });
                            });
                        }
                    }
                }
            }
        })
    }
}