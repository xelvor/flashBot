import { Message } from 'discord.js';
import Event from '../base/Event';
import { config } from '../config';

export default class musicButtons extends Event {
    constructor() {
        super({
            name: 'messageCreate',
            run: async (message: Message) => { 
                if (message.author.bot) return

                if (message.content.indexOf(config.prefix) !== 0) return;

                const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();

                
            }
        })
    }
}