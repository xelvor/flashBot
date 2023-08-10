import Event from '../base/Event';
import { commands, bot } from '../index';

export default class interactionCreate extends Event {
    constructor() {
        super({
            name: 'interactionCreate',
            run: async (interaction: any) => {
                if (!interaction.isCommand()) return;
                const command = commands.find(slashCommands => slashCommands.name === interaction.commandName)
                if (!command) return;

                try {
                    await command.run(interaction, bot);
                } catch(error) {
                    console.error(error);
                }
                
            }
        })
    }
}