import { EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import { User } from '../utils/models/user';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'balance',
            description: 'Add || Remove money',
            owner: false,
            options: [
                {
                    name: 'user',
                    description: 'Choose a user',
                    type: 6,
                    required: true
                },
                {
                    name: "account",
                    description: "Choose a account",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Bank",
                            value: "bank"
                        },
                        {
                            name: "Money",
                            value: "money"
                        }
                    ]
                },
                {
                    name: "type",
                    description: "Type of money",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "Add money",
                            value: "add"
                        },
                        {
                            name: "Remove money",
                            value: "remove"
                        }
                    ]
                },
                {
                    name: 'amount',
                    description: 'Enter the amount',
                    type: 10,
                    required: true
                }
            ],
            run: async (interaction: any) => {
                const member = interaction.options.getUser('user')
                const type = interaction.options.getString('type')
                const amount = interaction.options.getNumber('amount')
                const accountType = interaction.options.getString('account')

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
                    const user = await User.findOne({ id: member.id })
                    if (user) {
                        if (accountType == 'bank') {
                            if (type == 'add') {
                                user.bank_money += amount
                            } else if (type == 'remove') {
                                user.bank_money -= amount
                            }
                        } else {
                            if (type == 'add') {
                                user.money += amount
                            } else if (type == 'remove') {
                                user.money -= amount
                            }
                        }

                        await user.save()
                        const embed = new EmbedBuilder()
                        .setTitle('<a:tak:1043874690634096681> Success')
                        .setDescription('Balance has been changed')
                        .setColor('Green')
                        .addFields(
                            { name: '<:user:1139222572295274657> Moderator', value: `<@${interaction.member.user.id}>` },
                            { name: '<:user:1139222572295274657> User', value: `<@${member.id}>` },
                            { name: '<:cpu:1140390874732306584> Amount', value: `\`${amount}\`` }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: interaction.member.user.username,
                            iconURL: interaction.member.user.avatarURL()
                        })
                        return await interaction.editReply({ embeds: [embed] })
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