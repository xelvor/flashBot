import { EmbedBuilder, HexColorString, AttachmentBuilder } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'test2',
            description: 'asasdasdasdasdbot',
            owner: false,
            options: [
                {
                    name: 'text',
                    description: 'Example: {username} joined for the guild',
                    type: 3,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'choose a channel',
                    type: 7,
                    required: true
                },
                {
                    name: 'attachment',
                    description: 'choose a background of the image',
                    type: 11,
                    required: false
                }
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

                
            }
        })
    }
}