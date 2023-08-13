import { Client, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import { InviteM } from '../utils/models/invite';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'invites',
            description: 'Check count of the invites',
            owner: false,
            options: [
                {
                    name: 'user',
                    description: 'choose a user',
                    type: 6,
                    required: false
                }
            ],
            run: async (interaction: any, client: Client) => {
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })

                let member: any;
                if (!interaction.options.getUser('user')) {
                    member = interaction.member.user
                } else {
                    member = interaction.options.getUser('user')
                }

                let userInvites: Array<object> = []

                try {
                    const data = await InviteM.find({ guild: interaction.guild.id, inviter: member.id });
                    if (data) {
                        userInvites.push(data)
                    }
                } catch (error) {
                    console.error(error);
                }

                let acutal: number = 0
                let fake: number = 0
                let leaves: number = 0
                let invites: number = 0

                for (let invite of userInvites) {
                    // console.log(invite[0].id)
                    if (invite[0]) {
                        acutal += invite[0].actuall;
                        fake += invite[0].fake;
                        leaves += invite[0].leaves;
                        invites += invite[0].invites;
                    }
                }

                const embed2: EmbedBuilder = new EmbedBuilder()
                .setTitle('Invites')
                .addFields(
                    {
                        name: '<:user:1139222572295274657> User',
                        value: `\`${member.username}\``,
                        inline: true
                    },
                    {
                        name: '<:checked:1140351725732106313> Joins',
                        value: `\`${acutal}\``,
                        inline: true
                    },
                    {
                        name: '<:poop:1140347695266021499> Fake',
                        value: `\`${fake}\``,
                        inline: true
                    },
                    {
                        name: '<:unchecked:1140351923480969226> Leaves',
                        value: `\`${leaves}\``,
                        inline: true
                    },
                    {
                        name: '<:bonus:1140352088115789915> Bonus',
                        value: `\`0\``,
                        inline: true
                    },
                    {
                        name: '<:all:1140352280365903893> All',
                        value: `\`${acutal + fake + leaves}\``,
                        inline: true
                    }
                )
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.editReply({ embeds: [embed2] })
            }
        })
    }
}