import { Options } from '../interface/Event';

export default class Event {
    private help: Options;

    constructor(options: Options) {
        this.help = {
            name: options.name || null,
            run: options.run
        };
    }
}