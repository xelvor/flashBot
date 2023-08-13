import { GuildMember } from 'discord.js';
import Event from '../base/Event';
import { InviteM } from '../utils/models/invite';

export default class GuildMemberRemoveEvent extends Event {
    constructor() {
        super({
            name: 'guildMemberRemove',
            run: async (member: GuildMember) => {
                const savedInvites = await InviteM.find({ guild: member.guild.id });

                savedInvites.forEach(async (s) => {
                    //@ts-ignore
                    s.invitedUsers = s.invitedUsers.filter((invite) => invite.id !== member.id);
                    s.actuall -= 1;
                    s.leaves += 1;
                    await s.save();
                });
            },
        });
    }
}