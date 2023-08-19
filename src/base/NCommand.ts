import { Options } from '../interface/NCommand';

export default class NormalCommand {
    private help: Options;

    constructor(options: Options) {
        this.help = {
            name: options.name || null,
            description: options.description || null,
            run: options.run,
        };
    }
}