import { Client, GuildMember } from 'discord.js';
import Event from '../base/Event';
import { InviteM } from '../utils/models/invite';
import { Guild } from '../utils/models/guild';
import { client } from '../base/Client'
import { getCountOfActualInvites } from '../utils/invites/main';

export default class GuildMemberAddEvent extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
            run: async (member: GuildMember) => {

                let invitesCount: number = 0;
                let inviterID: string;


                try {
                    const newInvites = await member.guild.invites.fetch();
                    
                    const savedInvites = await InviteM.find({ guild: member.guild.id });

                    
                    newInvites.forEach(async (newInvite) => {
                        const savedInvite = savedInvites.find(inv => inv.code === newInvite.code);
                        
                        if (savedInvite) {
                            const { uses: newUses } = newInvite;
                            const { invites, invitedUsers, inviter } = savedInvite;
                            
                            if (newUses > invites) {
                                invitedUsers.push({
                                    id: member.user.id,
                                    guild: member.guild.id
                                })
                                
                                savedInvite.invites = newUses;
                                savedInvite.actuall += 1;
                                invitesCount = savedInvite.actuall
                                inviterID = inviter

                                await savedInvite.save();
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error processing guildMemberAdd event:', error);
                }

                Guild.findOne({ id: member.guild.id }).then(x => {
                    if (x) {
                        x.data.forEach(async data => {
                            //@ts-ignore
                            if (data.type == 'invite-logger') {
                                //@ts-ignore
                                let text = data.text
                                const user = await client.users.fetch(inviterID)
                                text = text.replace('{username}',member.user.username)
                                //@ts-ignore
                                text = text.replace('{invites}',await getCountOfActualInvites(user, member.guild))
                                text = text.replace('{inviter}',client.users.cache.get(inviterID).username)
                                //@ts-ignore
                                client.channels.cache.get(data.channelID).send(text)
                            }
                        })
                    }
                })
            },
        });
    }
}