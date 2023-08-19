import { EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import { User } from '../utils/models/user';

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
                try {
                    const user = await User.findOne({ id: interaction.member.id })
                    if (user) {
                        const embed = new EmbedBuilder()
                        .setTitle('Economy')
                        .addFields(
                            { name: '<:user:1139222572295274657> User', value: `<@${interaction.member.id}>` },
                            { name: '<:cpu:1140390874732306584> Money', value: `\`$${user.money}\`` },
                            { name: '<:cpu:1140390874732306584> Bank money', value: `\`$${user.bank_money}\`` }
                        )
                        .setColor(config.color as HexColorString)
                        .setTimestamp()
                        .setFooter({
                            text: interaction.member.user.username,
                            iconURL: interaction.member.user.avatarURL()
                        })
                        await interaction.editReply({ embeds: [embed] })
                    }
                } catch(e) {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('You dont have profile')
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    return await interaction.reply({ embeds: [embed] })
                }
            }
        })
    }
}