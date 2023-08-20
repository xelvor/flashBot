import { EmbedBuilder, HexColorString, Message } from "discord.js";
import NormalCommand from "../base/NCommand";
import { Guild } from "../utils/models/guild";

export default class evalCommand extends NormalCommand {
    constructor() {
        super({
            name: "premium",
            description: "Add premium to the server",
            run: async (message: Message, args: string[]) => {
                if (!message.member.roles.cache.get('1122948803608199239')) return;

                const guildID = args[0]
                try {
                    const guild = await Guild.findOne({ id: guildID })
                    if (!guild) {
                        message.reply("There is no guild with that name")
                    } else {
                        guild.premium = true
                        await guild.save()
                        message.reply("Premium added")
                    }
                } catch (error) {
                    message.reply("There is no guild with that name")
                }
            },
        });
    }
}