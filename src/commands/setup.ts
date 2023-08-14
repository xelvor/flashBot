import { EmbedBuilder, HexColorString, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';


export default class adminrole extends Command {
    constructor() {
        super({
            name: 'setup',
            description: 'Setup a server',
            owner: false,
            options: [],
            run: async (interaction: any, client: typeof bot) => {


                const component = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('starter')
                    .setPlaceholder('Make a selection!')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Invite logger')
                            .setDescription('Setup a invite logger.')
                            .setValue('invitelogger'),
                    )
                )

                await interaction.reply({
                    content: 'Choose a option',
                    components: [component],
                    ephemeral: true
                })
            }
        })
    }
}