import { Client, REST, Routes } from 'discord.js'
import { Options } from '../interface/Client'
import { readdirSync } from 'fs'
import { bot, commands, ownerCommands } from '../index'
import { config } from '../config'

export async function init(options: Options) {
    const client = new Client(options)

    client.login(options.token)

    return client
}

export async function loadEvents(client: typeof bot, path: string) {
    const eventFiles = readdirSync(path).filter(file => file.endsWith(".ts"));

    for (let file of eventFiles) {
        const evnt = await import(`../events/${file}`)
        const event = new evnt.default(client)
        await (await client).on(event.help.name, event.help.run)
    }
}

export async function registerCommands(commands: object, guild: string) {
    const rest = new REST({ version: '10' }).setToken(config.token);
    const data = await rest.put(
        Routes.applicationGuildCommands(config.client_id, guild),
        { body: commands },
    );
}

export async function loadCommand(client: any, path: string) {
    const eventFiles = readdirSync(path).filter(file => file.endsWith(".ts"));
    
    for (let file of eventFiles) {
        const cmd = await import(`../commands/${file}`)
        const command = new cmd.default(client)
        if (command.help.owner){
            ownerCommands.push(command.help)
        } else {
            commands.push(command.help)
        }
    }

    // await registerCommands(ownerCommands, '1122947672765112361')
}