import { GuildMember } from 'discord.js';
import Event from '../base/Event';

export default class guildMemberAdd extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
            run: async (member: GuildMember) => {
                
            }
        })
    }
}
