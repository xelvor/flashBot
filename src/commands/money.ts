import { EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'money',
            description: 'Check your money balance',
            owner: false,
            options: [],
            run: async (interaction: any) => {
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })
            }
        })
    }
}