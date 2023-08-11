import { Options } from '../interface/Command';

export default class Command {
    private help: Options;

    constructor(options: Options) {
        this.help = {
            name: options.name || null,
            description: options.description || null,
            run: options.run,
            options: options.options || [],
            owner: options.owner || false
        };
    }
}