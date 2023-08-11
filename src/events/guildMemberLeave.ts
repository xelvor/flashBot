import { GuildMember } from 'discord.js';
import Event from '../base/Event';
import { InviteM } from '../utils/models/invite';

export default class GuildMemberRemoveEvent extends Event {
    constructor() {
        super({
            name: 'guildMemberRemove',
            run: async (member: GuildMember) => {

                try {
                    const savedInvites = await InviteM.find({ guild: member.guild.id });
                    
                    savedInvites.forEach(async (savedInvite) => {
                        if (savedInvite.inviter === member.id) {
                            savedInvite.actuall -= 1;
                            savedInvite.leaves += 1;
                            await savedInvite.save()
                        }
                    });
                } catch (error) {
                    console.error('Error processing guildMemberRemove event:', error);
                }
            },
        });
    }
}