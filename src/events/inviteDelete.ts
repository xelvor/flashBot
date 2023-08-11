import { Client, Invite } from 'discord.js';
import Event from '../base/Event';
import { InviteM } from '../utils/models/invite';

export default class pingBot extends Event {
    constructor() {
        super({
            name: 'inviteDelete',
            run: async (invite: Invite, client: Client) => {    
                InviteM.deleteOne({ code: invite.code} ).then(s => {
                    
                })
            }
        })
    }
}