import { CommandInteraction, EmbedBuilder, HexColorString, PermissionFlagsBits } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban user',
            owner: false,
            options: [
                {
                    name: 'user',
                    description: 'Choose a user',
                    type: 6,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'Enter the reason',
                    type: 3,
                    required: true
                }
            ],
            run: async (interaction: CommandInteraction, client: typeof bot) => {
                //@ts-ignore
                const reason = interaction.options.getString('reason')

                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    //@ts-ignore
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })
                //@ts-ignore
                if (interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    const member = interaction.options.getUser('user')
                    const user = interaction.guild.members.fetch(member.id)
                    const guildRoles = interaction.guild.roles.cache
                    const highestUser = (await user).roles.highest
                    //@ts-ignore
                    const highestMember = interaction.member.roles.highest
                    const highestRole = guildRoles.find(role => role.id === highestUser.id).position
                    const highestMemberRole = guildRoles.find(role => role.id === highestMember.id).position
                    if (highestRole < highestMemberRole) {
                        try {
                            const guildMember = await interaction.guild.members.fetch(member.id)
                            try {
                                await guildMember.send(`You have been banned by **${interaction.member.user.username}** Reason: **${reason}** in **${interaction.guild.name}**`)
                            } catch(error) {
                            }
                            await guildMember.ban({
                                reason: `Banned by ${interaction.member.user.username} Reason: ${reason}`
                            })
                            const embed = new EmbedBuilder()
                            .setTitle('<a:tak:1043874690634096681> Success')
                            .setDescription('User has been banned')
                            .setColor('Green')
                            .addFields(
                                { name: '<:user:1139222572295274657> Moderator', value: `<@${interaction.member.user.id}>` },
                                { name: '<:user:1139222572295274657> User', value: `<@${member.id}>` },
                                { name: '<:version:1140391577206923425> Reason', value: `\`${reason}\`` }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: interaction.member.user.username,
                                //@ts-ignore
                                iconURL: interaction.member.user.avatarURL()
                            })
                            await interaction.editReply({ embeds: [embed] })
                        } catch(e) {
                            console.log('Error ban user')
                        }
                    } else {
                        const embed: EmbedBuilder = new EmbedBuilder()
                        .setTitle('<a:nie:1043874712155070504> Error')
                        .setDescription('Role is higher than yours!')
                        .setColor('Red')
                        .setTimestamp()
                        .setFooter({
                            text: interaction.member.user.username,
                            //@ts-ignore
                            iconURL: interaction.member.user.avatarURL()
                        })
                        await interaction.editReply({ embeds: [embed] })
                    }
                } else {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setDescription('You do not have permission to use this command!\nRequired permission: \`Ban Members\`')
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        //@ts-ignore
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.editReply({ embeds: [embed] })
                }
            }
        })
    }
}