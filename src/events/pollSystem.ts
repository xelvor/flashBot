import { BaseInteraction, EmbedBuilder, HexColorString, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import Event from '../base/Event';
import { Poll } from '../utils/models/poll';
import { config } from '../config';
import { client } from '../base/Client';

export default class PollSystem extends Event {
    constructor() {
        super({
            name: 'interactionCreate',
            run: async (interaction: BaseInteraction) => {
                if (!interaction.isButton()) return;

                Poll.findOne({ guild: interaction.guild.id }).then(async x => {
                    if (x) {
                        if (interaction.message?.embeds.length) {
                            for (const embed of interaction.message.embeds) {
                                //@ts-ignore
                                if (embed.description?.includes(x.text)) {
                                    for (let option of x.data) {
                                        //@ts-ignore
                                        if (interaction.customId == `option_${option.id}`) {
                                            //@ts-ignore
                                            const buttons = []
                                            for (let i = 0; i <= 6; i++) {
                                                const optionText = x.data[i]
                                                if (optionText) {
                                                    //@ts-ignore
                                                    buttons.push(optionText.text);
                                                }
                                            }

                                            const buttons2 = buttons.map((option, index) => {
                                                return new ButtonBuilder()
                                                    .setLabel(option)
                                                    .setCustomId(`option_${index + 1}`)
                                                    .setStyle(ButtonStyle.Primary);
                                            });

                                            const row = new ActionRowBuilder().addComponents(buttons2);

                                            //@ts-ignore
                                            for (let user of option.users) {
                                                if (user.id == interaction.member.user.id) {
                                                    return await interaction.reply({
                                                        content: "You alerdy choosed a option",
                                                        ephemeral: true
                                                    })
                                                }
                                            }

                                            

                                            //@ts-ignore
                                            option.count = option.count + 1
                                            //@ts-ignore
                                            option.users.push({
                                                id: interaction.member.user.id
                                            })
                                            x.markModified('data');
                                            await x.save();
                                            const embed = new EmbedBuilder()
                                            .setTitle('Pool')
                                            .setColor(config.color as HexColorString)
                                            .setTimestamp()
                                            //@ts-ignore
                                            .setDescription(`\`${x.text}\`\n\n${x.data.map(x => `> **${x.text}**\n${x.count}`).join('\n\n')}`)
                                            .setFooter({
                                                text: client.user.username,
                                                //@ts-ignore
                                                iconURL: client.user.avatarURL()
                                            })
                                            
                                            await interaction.message.edit({
                                                embeds: [embed],
                                                //@ts-ignore
                                                components: [row]
                                            })
                                            
                                            await interaction.reply({
                                                content: "asd",
                                                ephemeral: true
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                })
            }
        });
    }
}
