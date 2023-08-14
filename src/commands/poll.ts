import { EmbedBuilder, HexColorString, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import { Poll } from '../utils/models/poll';
import { generateRandomString } from '../utils/string/main';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'poll',
            description: 'Create a poll',
            owner: false,
            options: [
                {
                    name: 'text',
                    description: 'Text of the pool',
                    type: 3,
                    required: true
                },
                {
                    name: 'option1',
                    description: 'Add option',
                    type: 3,
                    required: false
                },
                {
                    name: 'option2',
                    description: 'Add option',
                    type: 3,
                    required: false
                },
                {
                    name: 'option3',
                    description: 'Add option',
                    type: 3,
                    required: false
                },
                {
                    name: 'option4',
                    description: 'Add option',
                    type: 3,
                    required: false
                },
                {
                    name: 'option5',
                    description: 'Add option',
                    type: 3,
                    required: false
                },
                {
                    name: 'option6',
                    description: 'Add option',
                    type: 3,
                    required: false
                },
            ],
            run: async (interaction: any, client: typeof bot) => {
                const text = interaction.options.getString('text')
                const options = [];
                const options2 = [];
                
                for (let i = 1; i <= 6; i++) {
                    const optionText = interaction.options.getString(`option${i}`);
                    if (optionText) {
                        options.push(optionText);
                    }
                }


                for (let i = 1; i <= 6; i++) {
                    const optionText = interaction.options.getString(`option${i}`);
                    if (optionText) {
                        options2.push({
                            count: 0,
                            text: optionText,
                            id: i,
                            users: []
                        });
                    }
                }


                const poll = new Poll({
                    text: text,
                    data: options2,
                    token: generateRandomString(15),
                    guild: interaction.guild.id,
                    users: []
                })

                poll.save()

                const embed = new EmbedBuilder()
                .setTitle('Pool')
                .setColor(config.color as HexColorString)
                .setTimestamp()
                .setDescription(`\`${text}\`\n\n${options.map(x => `> **${x}**\n0`).join('\n\n')}`)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                
                const buttons = options.map((option, index) => {
                    return new ButtonBuilder()
                        .setLabel(option)
                        .setCustomId(`option_${index + 1}`)
                        .setStyle(ButtonStyle.Primary);
                });

                const row = new ActionRowBuilder().addComponents(buttons);

                await interaction.reply({embeds: [embed], components: [row]})
            }
        })
    }
}