import { ChannelType, Guild, GuildChannel, GuildMember, VoiceBasedChannel } from 'discord.js';
import Event from '../base/Event';
import { client } from '../base/Client';

export default class GuildMemberRemoveEvent extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
            run: async (oldState, newState) => {
                const user = newState.member.user;
                const guild: Guild = newState.guild;
                const guildMember = guild.members.cache.get(user.id);
                const joinedChannel = newState.channel;
                const leftChannel = oldState.channel;
                
                const targetChannelId = '1142938752424099900';
            
                if (!leftChannel && joinedChannel && joinedChannel.id === targetChannelId) {
                    const channel: VoiceBasedChannel = await newState.guild.channels.create({
                        name: `${user.username}`,
                        type: ChannelType.GuildVoice,
                        parent: joinedChannel.parentId,
                    });

                    await guildMember.voice.setChannel(channel)
                }
            },
        });
    }
}
