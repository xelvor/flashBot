import { init, loadEvents, loadCommand } from './base/Client';
import { config } from './config';
import express, { Request, Response } from 'express';
import { GatewayIntentBits } from 'discord.js'

export const bot = init({
    intents: 3276799,
    token: config.token,
    config: config,
})

export const commands = []

loadEvents(bot, './src/events')
loadCommand(bot, './src/commands')