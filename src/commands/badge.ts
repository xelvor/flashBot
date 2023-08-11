import { Client, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import { isPlayerHaveOwnerPermission } from '../utils/permissions/main';
import { getBadgeNameByValue } from '../utils/badges/main';
import { User } from '../utils/models/user';
import { newUser } from '../utils/users/main';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'badge',
            description: 'add custom badge',
            owner: false,
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
            run: async (interaction: any, client: Client) => {
                const member = interaction.options.getUser('user')
                const value = interaction.options.getString('badge')

                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })
                
                if (await isPlayerHaveOwnerPermission(client, interaction.member.id)) {
                    User.findOne({ id: member.id }).then(async user => {
                        if (user) {
                            const badges = user.badges;
                            //@ts-ignore
                            const badge = badges.find(b => b.value === value);
                            if (badge) {
                                const embed = new EmbedBuilder()
                                    .setTitle('<a:nie:1043874712155070504> Error')
                                    .setColor('Red')
                                    .setDescription('This user already have this badge')
                                    .setTimestamp()
                                    .setFooter({
                                        text: interaction.member.user.username,
                                        iconURL: interaction.member.user.avatarURL()
                                    });
                                await interaction.editReply({ embeds: [embed] });
                            } else {
                                //@ts-ignore
                                badges.push({
                                    value: value
                                });
                                user.markModified('badges');
                                await user.save();
                            }
                        } else {
                            newUser(member.username, member.id, member.user.discriminator, 0, 0, [
                                {
                                    value: value
                                }
                            ]);
                        }
                    });
                    
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:tak:1043874690634096681> Success')
                    .setColor('Green')
                    .setDescription('The badge was given successfully')
                    .addFields(
                    {
                        name: "<:user:1139222572295274657> User",
                        value: `\`${member.username}\``
                    },
                    {
                        name: "<:badges:1139228708989841458> Badge",
                        value: `\`${getBadgeNameByValue(value)}\``
                    })
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.editReply({ embeds: [embed] })
                } else {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('You do not have permission to use this command')
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