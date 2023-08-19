import { ColorResolvable, Embed, EmbedBuilder, GuildBanManager, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import axios from 'axios';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'unban',
            description: 'Unban user',
            owner: false,
            options: [
                {
                    name: 'id',
                    description: 'Enter id',
                    type: 3,
                    required: true
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

                const id = interaction.options.getString('id')
                try {
                    const guildBans: GuildBanManager = await interaction.guild.bans.fetch(id)
                    await interaction.guild.bans.remove(id, `Unbanned by ${interaction.member.user.username}`)
                    const embed = new EmbedBuilder()
                    .setTitle('<a:tak:1043874690634096681> Success')
                    .setDescription(`User has been unbanned`)
                    .addFields(
                        { name: '<:user:1139222572295274657> Moderator', value: `<@${interaction.member.user.id}>` },
                        { name: '<:user:1139222572295274657> User', value: `<@${id}>` },
                        { name: '<:cpu:1140390874732306584> Reason', value: `\`Unbanned by ${interaction.member.user.username}\`` }
                    )
                    .setColor('Green')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.editReply({ embeds: [embed] })
                } catch(e) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setDescription(`This user isn't banned`)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.editReply({ embeds: [embed] })
                }
            }
        })
    }
}