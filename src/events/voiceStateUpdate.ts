import { ChannelType } from 'discord.js';
import Event from '../base/Event';
import { client } from '../base/Client';

export default class GuildMemberRemoveEvent extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
            run: async (oldState, newState) => {
                const user = newState.member.user;
                const guild = newState.guild;
                const joinedChannel = newState.channel;
                const leftChannel = oldState.channel;

                const targetChannelId = '1142948419413999636';
                const channelPrefix = 'channel-'
            
                if (!leftChannel && joinedChannel && joinedChannel.id === targetChannelId) {
                    let newChannelName = `${channelPrefix}${user.username}`;
                    
                    const similarChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice && channel.name.startsWith(channelPrefix));

                    if (similarChannels.some(channel => channel.name === newChannelName)) {

                        let suffixNumber = 1;
                        while (similarChannels.some(channel => channel.name === `${newChannelName}-${suffixNumber}`)) {
                            suffixNumber++;
                        }
                        newChannelName = `${newChannelName}-${suffixNumber}`;

                    }

                    const channel = await newState.guild.channels.create({

                        name: newChannelName,
                        type: ChannelType.GuildVoice,
                        parent: joinedChannel.parentId,

                    });

                    await newState.member.voice.setChannel(channel);
                }

                if (leftChannel && leftChannel.name.startsWith(channelPrefix) && leftChannel.members.size === 0) {

                    await leftChannel.delete();
                    
                }
            },
        });
    }
}
