import { connect } from 'mongoose';
import { init, loadEvents, loadCommand, loadNCommand } from './base/Client';
import { config } from './config';

export const bot = init({
    intents: 3276799,
    token: config.token,
    config: config,
})

export const commands = []
export const ownerCommands = []
export const nCommands = []
export const guildsInvites = []
export const music: Array<object> = []

loadEvents(bot, './src/events')
loadCommand(bot, './src/commands')
loadNCommand(bot, './src/normalCommands')

connect('mongodb://127.0.0.1:27017/flashbot')