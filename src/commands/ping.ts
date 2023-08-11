import { ColorResolvable, Embed, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import axios from 'axios';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Check ping of the bot',
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
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })
                let ping = Date.now() - interaction.createdTimestamp
                let botPing = Date.now();
                await axios.get('https://google.com')
                botPing = Date.now() - botPing;
                const embed2: EmbedBuilder = new EmbedBuilder()
                .setTitle(config.server_name)
                .setDescription(`\`\`\`py\nAPI latency ${ping} ms\nBot latency ${botPing} ms\`\`\``) 
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.editReply({ embeds: [embed2] })
            }
        })
    }
}