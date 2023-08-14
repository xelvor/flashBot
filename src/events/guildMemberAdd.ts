import { GuildMember } from 'discord.js';
import Event from '../base/Event';
import { InviteM } from '../utils/models/invite';

export default class GuildMemberAddEvent extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
            run: async (member: GuildMember) => {
                try {
                    const newInvites = await member.guild.invites.fetch();
                    
                    const savedInvites = await InviteM.find({ guild: member.guild.id });

                    
                    newInvites.forEach(async (newInvite) => {
                        const savedInvite = savedInvites.find(inv => inv.code === newInvite.code);
                        
                        if (savedInvite) {
                            const { uses: newUses } = newInvite;
                            const { invites, fake, leaves, actuall, invitedUsers } = savedInvite;
                            
                            if (newUses > invites) {
                                //@ts-ignore

                                invitedUsers.push({
                                    id: member.user.id,
                                    guild: member.guild.id
                                })
                                
                                savedInvite.invites = newUses;
                                savedInvite.actuall += 1;

                                
                                await savedInvite.save();
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error processing guildMemberAdd event:', error);
                }
            },
        });
    }
}