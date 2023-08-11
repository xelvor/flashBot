import { ColorResolvable, Embed, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import axios from 'axios';

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
            run: async (interaction: any, client: typeof bot) => {
                (await client).emit('guildMemberAdd', interaction.member)
                interaction.reply('emited')
            }
        })
    }
}