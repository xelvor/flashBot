import { EmbedBuilder, HexColorString, Message } from "discord.js";
import NormalCommand from "../base/NCommand";

export default class evalCommand extends NormalCommand {
    constructor() {
        super({
            name: "eval",
            description: "Evaluates code",
            run: async (message: Message, args: string[]) => {
                if (!message.member.roles.cache.get('1122948803608199239')) return;

                const code = args.join(" ");
                try {
                    const result = await eval(code);
                    const embed = new EmbedBuilder()
                    .setTitle('<a:tak:1043874690634096681> Success')
                    .setDescription(`\`\`\`js\n${result}\`\`\``)
                    .setColor('Green')
                    .setTimestamp()
                    .setFooter({
                        text: message.member.user.username,
                        iconURL: message.member.user.avatarURL()
                    })
                    await message.reply({ embeds: [embed] });
                } catch (error) {
                    const embed = new EmbedBuilder()
                    .setTitle('<a:nie:1043874712155070504> Error')
                    .setDescription(`\`\`\`js\n${error}\`\`\``)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({
                        text: message.member.user.username,
                        iconURL: message.member.user.avatarURL()
                    })
                    await message.reply({ embeds: [embed] });
                }
            },
        });
    }
}