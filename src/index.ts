import { init, loadEvents, loadCommand } from './base/Client';
import { config } from './config';

export const bot = init({
    intents: 3276799,
    token: config.token,
    config: config,
})

export const commands = []

loadEvents(bot, './src/events')
loadCommand(bot, './src/commands')