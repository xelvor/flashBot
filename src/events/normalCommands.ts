import { EmbedBuilder, Message } from 'discord.js';
import Event from '../base/Event';
import { config } from '../config';
import { nCommands } from '..';

export default class musicButtons extends Event {
    constructor() {
        super({
            name: 'messageCreate',
            run: async (message: Message) => { 
                if (message.author.bot) return

                if (message.content.indexOf(config.prefix) !== 0) return;

                const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();

                const cmd = nCommands.find(x => x.name === command)
                if (!cmd) {
                    const embed = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setColor('Red')
                    .setDescription('This command doesn\'t exist')
                    .setTimestamp()
                    .setFooter({
                        text: message.member.user.username,
                        iconURL: message.member.user.avatarURL()
                    })
                    return await message.reply({ embeds: [embed] })
                }
                cmd.run(message, args);
            }
        })
    }
}