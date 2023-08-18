import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, Embed, EmbedBuilder, GuildChannel, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import play from 'play-dl'
import {  AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import  ytSearch from 'yt-search'
import { music } from '..';

export let exportInteraction: CommandInteraction;

export async function nextQueue(songData: Array<object>, channel: GuildChannel, video, memberVoiceChannel, interaction) {
    try {
        const stream = await play.stream(video.url)
        const player = createAudioPlayer();
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });
    
        //@ts-ignore
        music[interaction.guild.id].connection = joinVoiceChannel({
            channelId: memberVoiceChannel.id,
            guildId: memberVoiceChannel.guild.id,
            adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator
        });
        //@ts-ignore
        const connection = music[interaction.guild.id].connection
    
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
          //@ts-ignore
          music[interaction.guild.id].shift()
          //@ts-ignore
          if (music[interaction.guild.id].length > 1) {
          } else {
            connection.disconnect()
            connection.destroy()
          }

          setTimeout(async () => {
            if (music[interaction.guild.id][0] > 1) {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                };
                
                const newVideo = await videoFinder(music[interaction.guild.id][0].link);
                nextQueue(music[interaction.guild.id][0], interaction.channel, newVideo, memberVoiceChannel, interaction)
            }
            }, 100);
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
            .setCustomId('queue')
            .setLabel('Queue')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('lyrics')
            .setLabel('Lyrics')
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Link')
            .setURL(video.url)
        )
        //@ts-ignore
        await interaction.editReply({ embeds: [embed], components: [button] })

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

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'play',
            description: 'Play mussic',
            owner: false,
            options: [
                {
                    name: 'youtube',
                    description: 'search in youtube',
                    type: 1,
                    options: [
                        {
                            name: "video",
                            description: "Enter the video name",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: 'spotify',
                    description: 'Bot play a music from your status',
                    type: 1,
                }
            ],
            run: async (interaction: any) => {
                exportInteraction = interaction
                let link: string;

                const subcommand = interaction.options.getSubcommand();
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })

                switch (subcommand) {
                    case 'youtube':
                        link = interaction.options.getString('video')
                    break
                    case 'spotify':
                        let activities = interaction.member?.presence?.activities || [];
                
                        let activity = activities.find(e => e.name == 'Spotify');
        
                        if (activity) {
                            link = `${activity.state} - ${activity.details}`
                        } else {
                            const embed: EmbedBuilder = new EmbedBuilder()
                            .setTitle('<a:nie:1043874712155070504> Error')
                            .setDescription(`No Spotify activity at the moment. Feel free to play some tunes and let the music flow!`)
                            .setColor('Red')
                            .setFooter({
                                text: interaction.member.user.username,
                                iconURL: interaction.member.user.avatarURL()
                            })
                            .setTimestamp()
                            await interaction.editReply({embeds: [embed]})
                        }
                    break
                }

                const memberVoiceChannel = interaction.member?.voice.channel;
                if (!memberVoiceChannel) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('You need to be in a voice channel to use this command.')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    return await interaction.editReply({ embeds: [embed] })
                }
                
                try {
                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                    };

                    const video = await videoFinder(link);
                    if (music[interaction.guild.id]) {
                        //@ts-ignore
                        if (music[interaction.guild.id].length > 0) {
                            //@ts-ignore
                            music[interaction.guild.id].push({
                                added: interaction.member.user.id,
                                title: video.title,
                                link: video.url
                            })

                            const embed = new EmbedBuilder()
                            .setTitle('Queue')
                            .setDescription(`Added song to queue`)
                            .setTimestamp()
                            .addFields(
                                {
                                    name: "<:user:1139222572295274657> User:",
                                    value: `<@${interaction.member.user.id}>`
                                },
                                {
                                    name: "<:musical:1141482466050314310> Song name:",
                                    value: `\`${video.title}\``
                                }
                            )
                            .setColor(config.color as HexColorString)
                            .setFooter({
                                text: interaction.member.user.username,
                                iconURL: interaction.member.user.avatarURL()
                            })
                            return await interaction.editReply({embeds: [embed]})
                        }

                    }

                    if (!music[interaction.guild.id]) {
                        music[interaction.guild.id] = []
                        music[interaction.guild.id]
                    }

                
                    
                    try {
                        //@ts-ignore
                        music[interaction.guild.id].push({
                            added: interaction.member.user.id,
                            title: video.title,
                            link: video.url
                        })


                        if (video) {
                            try {
                                nextQueue(music[interaction.guild.id][0], interaction.channel, video, memberVoiceChannel, interaction)
                            } catch(e) {
                                
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
