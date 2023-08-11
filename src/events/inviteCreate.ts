import { Invite } from 'discord.js';
import Event from '../base/Event';
import { newInvite } from '../utils/invites/main';

export default class pingBot extends Event {
    constructor() {
        super({
            name: 'inviteCreate',
            run: async (invite: Invite) => {    
                newInvite(invite.inviterId, 0, 0, 0, 0, invite.code)
            }
        })
    }
}