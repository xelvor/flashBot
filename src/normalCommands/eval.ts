import { Message } from "discord.js";
import NormalCommand from "../base/NCommand";

export default class evalCommand extends NormalCommand {
    constructor() {
        super({
            name: "eval",
            description: "Evaluates code",
            run: async (message: Message) => {
                message.reply('xdd')
            },
        });
    }
}