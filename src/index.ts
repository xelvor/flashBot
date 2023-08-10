import { init, loadEvents, loadCommand } from './base/Client';
import { config } from './config';
import express, { Request, Response } from 'express';
import { GatewayIntentBits } from 'discord.js'
import Client from './api/Client'
import createModule from './api/Socket'
import { createDBConnection } from './db';

export const bot = init({
    intents: 3276799,
    token: config.token,
    config: config,
    api: Client
})

export const commands = []

loadEvents(bot, './src/events')
loadCommand(bot, './src/commands')


// setTimeout(() => {
//     createModule(bot)
//     app.listen(8080, () => {
//         console.log('Api running on port 8080');
//       });
// },5000)

// async function main() {
// 	try {
// 		const client = new Client();
// 		const result = await client.resources.resource.test();
// 		console.log(result);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// main();