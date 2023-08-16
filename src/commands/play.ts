import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import play from 'play-dl'
import {  AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import  ytSearch from 'yt-search'

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'play',
            description: 'Play mussic',
            owner: false,
            options: [
                {
                    name: 'name',
                    description: 'Enter the video name',
                    type: 3,
                    required: true
                }
            ],
            run: async (interaction: any) => {
                //@ts-ignore
                const link = interaction.options.getString('name')

                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    //@ts-ignore
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })

                //@ts-ignore
                const memberVoiceChannel = interaction.member?.voice.channel;
                if (!memberVoiceChannel) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('You need to be in a voice channel to use this command.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        //@ts-ignore
                        iconURL: interaction.member.user.avatarURL()
                    })
                    return await interaction.editReply({ embeds: [embed] })
                }
                
                try {
                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                    };
                    
                    try {
                        const video = await videoFinder(link);
                        if (video) {
                            try {
                                const stream = await play.stream(video.url)
        
                                const player = createAudioPlayer();
                                const resource = createAudioResource(stream.stream, {
                                    inputType: stream.type
                                });
    
                                const connection = joinVoiceChannel({
                                    channelId: memberVoiceChannel.id,
                                    guildId: memberVoiceChannel.guild.id,
                                    adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator
                                });
            
                                await player.play(resource);
                                connection.subscribe(player);
                          
                                player.on('error', (error) => console.error(error));
                                player.on(AudioPlayerStatus.Idle, async() => {
                                  console.log(`song's finished`);
                                  const embed: EmbedBuilder = new EmbedBuilder()
                                  .setTitle(video.title)
                                  .setDescription('Music has been ended')
                                  .setColor(config.color as HexColorString)
                                  .setFooter({
                                      text: interaction.member.user.username,
                                      //@ts-ignore
                                      iconURL: interaction.member.user.avatarURL()
                                  })
                                  .setTimestamp()
                                  await interaction.editReply({ embeds: [embed], components: [] })
                                });
        
                                const embed = new EmbedBuilder()
                                .setTitle('<:musical:1141482466050314310> Music')
                                .setDescription('Started playing music')
                                .addFields(
                                    {
                                        name: '<:user:1139222572295274657> User',
                                        value: `<@${interaction.member.user.id}>`
                                    },
                                    {
                                        name: '<:musical:1141482466050314310> Title',
                                        value: `\`${video.title}\``
                                    },
                                    {
                                        name: '<:version:1140391577206923425> Description',
                                        value: `\`${video.description}\``
                                    },
                                    {
                                        name: '<:cpu:1140390874732306584> Views',
                                        value: `\`${video.views}\``
                                    },
                                    {
                                        name: '<:link:1139222567933190247> Author',
                                        value: `\`${video.author.name}\` [Link](${video.author.url})`
                                    },
                                                                    {
                                        name: '<:clock:1141490175172681789> Time',
                                        value: `\`${video.timestamp}\``
                                    },
                                )
                                .setColor(config.color as HexColorString)
                                .setTimestamp()
                                .setImage(video.thumbnail)
                                .setFooter({
                                    text: interaction.member.user.username,
                                    //@ts-ignore
                                    iconURL: interaction.member.user.avatarURL()
                                })
                                const button = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId('skip')
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel('Skip track'),
                                    new ButtonBuilder()
                                    .setCustomId('stop')
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel('Stop music'),
                                    new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel('Link')
                                    .setURL(video.url)
                                )
                                //@ts-ignore
                                await interaction.editReply({ embeds: [embed], components: [button] })
                                
                                const collector = interaction.channel.createMessageComponentCollector({
                                    filter: (i) => i.user.id === interaction.member.user.id,
                                    time: 60000
                                });
        
                                collector.on('collect', async(i) => {
                                    if (i.customId == 'stop') {
                                        connection.disconnect();
                                        const embed: EmbedBuilder = new EmbedBuilder()
                                        .setTitle(video.title)
                                        .setDescription('Music has been stopped')
                                        .setColor(config.color as HexColorString)
                                        .setFooter({
                                            text: interaction.member.user.username,
                                            //@ts-ignore
                                            iconURL: interaction.member.user.avatarURL()
                                        })
                                        .setTimestamp()
                                        await interaction.editReply({ embeds: [embed], components: [] })

                                    }
                                })
                            } catch (error) {
                                console.error(error);
                                const embed: EmbedBuilder = new EmbedBuilder()
                                .setTitle('<a:nie:1043874712155070504> Error')
                                .setColor('Red')
                                .setDescription('Video has been not found.')
                                .setTimestamp()
                                .setFooter({
                                    text: interaction.member.user.username,
                                    //@ts-ignore
                                    iconURL: interaction.member.user.avatarURL()
                                })
                                await interaction.editReply({ embeds: [embed] })
                            }   
                        }
                    } catch(erorr) {
                        const embed: EmbedBuilder = new EmbedBuilder()
                        .setTitle('<a:nie:1043874712155070504> Error')
                        .setColor('Red')
                        .setDescription('Video has been not found.')
                        .setTimestamp()
                        .setFooter({
                            text: interaction.member.user.username,
                            //@ts-ignore
                            iconURL: interaction.member.user.avatarURL()
                        })
                        await interaction.editReply({ embeds: [embed] })
                    }
                
    

                } catch (error) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('An error occurred while trying to join the voice channel.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        //@ts-ignore
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.editReply({ embeds: [embed] })
                    console.error(error);
                }
            }
        });
    }
}
