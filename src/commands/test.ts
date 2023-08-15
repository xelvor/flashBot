import { client } from '../base/Client';
import Command from '../base/Command';
import { bot } from '../index'
import { getCountOfActualInvites } from '../utils/invites/main';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'test',
            description: 'emit event',
            owner: false,
            options: [
                // {
                //     name: 'kanal',
                //     description: 'Wybierz kanal',
                //     type: 7,
                //     required: true
                // }
            ],
            run: async (interaction: any) => {
                client.emit('guildMemberAdd', interaction.member)
                interaction.reply('emited')
                // console.log(await getCountOfActualInvites(interaction.guild, interaction.member))
            }
        })
    }
}