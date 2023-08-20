import { EmbedBuilder, HexColorString, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import Command from '../base/Command';
import { isPlayerHavePermissions } from '../utils/permissions/main';
import { client } from '../base/Client';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'setup',
            description: 'Setup a server',
            owner: false,
            options: [],
            run: async (interaction: any) => {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('You do not have permission to use this command')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    return await interaction.reply({ embeds: [embed] })
                }

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
                            new StringSelectMenuOptionBuilder()
                            .setLabel('Anty invite')
                            .setDescription('Setup a Anty invite.')
                            .setValue('antyinvite'),
                            new StringSelectMenuOptionBuilder()
                            .setLabel('Greet')
                            .setDescription('Setup a greet.')
                            .setValue('greet'),
                            new StringSelectMenuOptionBuilder()
                            .setLabel('Welcome message')
                            .setDescription('Setup a welcome message.')
                            .setValue('welcomemessage'),
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