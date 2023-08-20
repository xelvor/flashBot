import { ChannelType, Guild, GuildChannel, GuildMember } from 'discord.js';
import Event from '../base/Event';

export default class GuildMemberRemoveEvent extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
            run: async (oldState, newState) => {
                const user = newState.member.user;
                const joinedChannel = newState.channel;
                const leftChannel = oldState.channel;
                
                const targetChannelId = '1142938752424099900';
            
                if (!leftChannel && joinedChannel && joinedChannel.id === targetChannelId) {
                    const channel = newState.guild.channels.create({
                        name: `${user.username}`,
                        type: ChannelType.GuildVoice,
                        parent: joinedChannel.parent
                    });
                    
                    channel.createOverwrite(user, {
                        CONNECT: true,
                        SPEAK: true,
                        MUTE: true,
                        DEAF: true,
                    })
                    
                    user.voice.setChannel(channel.id);
                }
            },
        });
    }
}
