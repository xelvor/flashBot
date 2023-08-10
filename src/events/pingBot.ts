import { HexColorString, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Event from '../base/Event';
import { bot } from '../index';
import { EmbedBuilder } from '@discordjs/builders';
import { config } from '../config';
import { hexToRgb } from '../utils/colors/main';

export default class pingBot extends Event {
    constructor() {
        super({
            name: 'messageCreate',
            run: async (message: any) => {    
                if (message.content == '<@1037769468908146721>') {
                    const embed: EmbedBuilder = new EmbedBuilder()
                    .setTitle('It looks like someone tagged me!')
                    .setDescription(`
                    To learn more about the bot, type \`/info\`
                    To get a list of available commands, type \`/help\`
                    `)
                    .setFooter({
                        text: message.member.user.username,
                        iconURL: message.member.user.avatarURL()
                    })
                    .setColor([hexToRgb(config.color).r,hexToRgb(config.color).g,hexToRgb(config.color).b])
                    .setTimestamp()
                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setURL('https://discord.com/api/oauth2/authorize?client_id=1037769468908146721&permissions=8&scope=bot%20applications.commands')
                        .setLabel("Invite bot")
                        .setStyle(ButtonStyle.Link)
                    )
                    await message.reply({ embeds: [embed], components: [button] })
                }
            }
        })
    }
}