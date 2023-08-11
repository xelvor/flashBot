import { EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import { badges } from '../utils/badges/main';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'badge',
            description: 'Add bot badge',
            owner: true,
            options: [
                {
                    name: 'user',
                    description: 'Choose a user',
                    type: 6,
                    required: true
                },
                {
                    name: 'badge',
                    description: 'Choose a badge',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Bot owner',
                            value: 'owner'
                        },
                        {
                            name: 'Bot staff',
                            value: 'staff'
                        }
                    ]
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