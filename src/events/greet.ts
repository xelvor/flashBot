import { GuildMember } from 'discord.js';
import Event from '../base/Event';
import { Guild } from '../utils/models/guild';

interface data {
    type: string;
    channelID: string;
}

export default class GuildMemberAddEvent extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
            run: async (member: GuildMember) => {
                try {
                    const data = await Guild.findOne({ id: member.guild.id });
                    if (data) {
                        const serverData = data.data;
                        if (serverData.length > 0) {
                            serverData.forEach(async (x: data) => {
                                if (x.type == 'greet') {
                                    const channel = member.guild.channels.cache.get(x.channelID);
                                    if (channel) {
                                        //@ts-ignore
                                        await channel.send({ content: `<@${member.user.id}>` });
                                    }
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error processing guildMemberAdd event:', error);
                }
            },
        });
    }
}