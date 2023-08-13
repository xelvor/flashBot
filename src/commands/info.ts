import { ColorResolvable, Embed, EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import axios from 'axios';
import { toTimestamp } from '../utils/date/main';
import { readdirSync } from 'fs';
import os from 'os'; // Import modułu os
import { resolve } from 'path'; // Importujemy moduł 'path' aby poprawnie ustalić ścieżkę

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'info',
            description: 'info',
            owner: false,
            options: [
                // {
                //     name: 'kanal',
                //     description: 'Wybierz kanal',
                //     type: 7,
                //     required: true
                // }
            ],
            run: async (interaction: any, client: typeof bot) => {
                const embed: EmbedBuilder = new EmbedBuilder()
                    .setDescription('Loading...')
                    .setColor(config.color as HexColorString)
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                
                let ping = Date.now() - interaction.createdTimestamp;
                let botPing = Date.now();
                const created = (await client).user.createdAt;
                const cpuUsage = process.cpuUsage(); // Pobieramy informacje o użyciu procesora
                const usedMemory = os.freemem() / 1024 / 1024;
                const totalMemory = os.totalmem() / 1024 / 1024;
                const userCPUUsage = (cpuUsage.user + cpuUsage.system) / 1000000; // W milisekundach
                const totalCpuUsage = userCPUUsage / os.cpus().length; // Uśredniamy na wszystkich rdzeniach
                await axios.get('https://google.com');
                botPing = Date.now() - botPing;

                const discordJsVersion = require('discord.js').version;

                const embed2: EmbedBuilder = new EmbedBuilder()
                    .setTitle(`Bot info (${(await client).user.username})`)
                    .addFields(
                        {
                            name: '<:staff:1139452295038378016> Owners\n',
                            value: '<@1024181668896051220> \`(1024181668896051220)\`\n <@1138930980313370657> \`(1138930980313370657)\`',
                        },
                        {
                            name: '<:cpu:1140390874732306584> Ram',
                            value: `\`${usedMemory.toFixed(2)} MB / ${totalMemory.toFixed(2)} MB\``
                        },
                        {
                            name: '<:version:1140391577206923425> Discord.js version', 
                            value: `\`Discord.js v${discordJsVersion}\`` ,
                        },
                        {
                            name: '<:pc:1139222560878379088> Operation system',
                            value: `\`${os.platform}\``,
                        },
                        {
                            name: '<:cpu:1140390874732306584> Cpu name',
                            value: `\`${os.cpus()[0].model}\``
                        },
                        {
                            name: '<:cpu:1140390874732306584> Cpu usage',
                            value: `\`${userCPUUsage}%\``
                        },
                        {
                            name: '<:created:1140386863023149218> Created at',
                            value: `<t:${toTimestamp(created)}:R>`
                        },
                    )
                    .setColor(config.color as HexColorString)
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed2] });
            }
        });
    }
}
