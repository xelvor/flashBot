import { EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import axios from 'axios';


export default class adminrole extends Command {
    constructor() {
        super({
            name: 'ask-gpt',
            description: 'Ask GPT',
            owner: false,
            options: [
                {
                    name: 'question',
                    description: 'Question',
                    type: 3,
                    required: true
                }
            ],
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
                    const response = await axios.get(`http://localhost:8080/getApi/?message=${interaction.options.getString('question')}&id=${interaction.user.id}`)
                    const embed = new EmbedBuilder()
                    .setTitle('GPT')
                    .setDescription(response.data)
                    .setColor(config.color as HexColorString)
                    .setTimestamp()
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    await interaction.editReply({ embeds: [embed] })
                } catch (e) {
                    console.log(e)
                    // const embed: EmbedBuilder = new EmbedBuilder()
                    // .setTitle('<a:nie:1043874712155070504> Error')
                    // .setColor('Red')
                    // .setDescription('Something went wrong')
                    // .setTimestamp()
                    // .setFooter({
                    //     text: interaction.member.user.username,
                    //     iconURL: interaction.member.user.avatarURL()
                    // })
                    // return await interaction.editReply({ embeds: [embed] })
                }
            }
        })
    }
}