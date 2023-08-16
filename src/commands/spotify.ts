import { AttachmentBuilder, Client, EmbedBuilder } from 'discord.js';
import Command from '../base/Command';
import { Spotify} from 'canvacord';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'spotify',
            description: 'Check your spotify status',
            owner: false,
            options: [],
            run: async (interaction: any) => {
                let activities = interaction.member?.presence?.activities || [];
                
                let activity = activities.find(e => e.name == 'Spotify');

                if (activity) {
                    
                    const spotify = new Spotify()
                    .setAuthor(activity.state)
                    .setAlbum(activity.assets.largeText)
                    .setStartTimestamp(activity.timestamps.start)
                    .setEndTimestamp(activity.timestamps.end)
                    .setBackground('COLOR', '#292929')
                    .setProgressBar('BAR','#96D3FF')
                    .setImage(`https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`)
                    .setTitle(activity.details)
    
                    spotify.build().then(async data => {
                        const attachment = new AttachmentBuilder(data)
                        .setName('spotify-iq65_.png')
                        await interaction.reply({
                            files: [attachment]
                        })
                    })
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
                    await interaction.reply({embeds: [embed]})
                }
            }
        })
    }
}