import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { config } from '../config';
import Canvas from 'canvas'

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'Check your avatar',
            owner: false,
            options: [
                {
                    name: 'user',
                    description: 'Choose a user',
                    type: 6,
                    required: false
                },
                {
                    name: "type",
                    description: "Type of avatar",
                    type: 3,
                    required: false,
                    choices: [
                        {
                            name: "Greet avatar",
                            value: "greet"
                        },
                        {
                            name: "Circle avatar",
                            value: "circle"
                        }
                    ]
                }
            ],
            run: async (interaction: any) => {
                let member;
                if (interaction.options.getUser('user')) {
                    member = interaction.options.getUser('user')
                } else {
                    member = interaction.member
                }
                const type = interaction.options.getString('type')
                let image;
                if (interaction.options.getUser('user')) {
                    image = member.displayAvatarURL()
                } else {
                    image = interaction.member.displayAvatarURL()
                }
                if (type) {
                    const canvas = Canvas.createCanvas(512, 512);
                    if (type == 'circle') {
                        const ctx = canvas.getContext('2d');
                        ctx.beginPath();
                        ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(await Canvas.loadImage(image), 0, 0, canvas.width, canvas.height);
                        const attachment = new AttachmentBuilder(canvas.toBuffer())
                        .setName('avatar-circle-iq-bot.png')
                        image = attachment
                    }
                }
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })

                if (interaction.options.getUser('user')) {
                    const embed2: EmbedBuilder = new EmbedBuilder()
                    .setTitle(interaction.options.getUser('user') ? `Avatar of ${member.username}` : `My Avatar`)
                    .setImage(image)
                    .setColor(config.color as HexColorString)
                    .addFields(
                        { name: '<:user:1139222572295274657> User', value: `<@${member.id}>` },
                    )
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp()
                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setURL(member.avatarURL())
                        .setLabel("Avatar")
                        .setStyle(ButtonStyle.Link)
                    )
                    await interaction.editReply({ embeds: [embed2], components: [button] })
                } else {
                    const embed2: EmbedBuilder = new EmbedBuilder()
                    .setTitle(interaction.options.getUser('user') ? `Avatar of ${member.username}` : `My Avatar`)
                    .setImage(image)
                    .setColor(config.color as HexColorString)
                    .addFields(
                        { name: '<:user:1139222572295274657> User', value: `<@${interaction.member.user.id}>` },
                    )
                    .setFooter({
                        text: interaction.member.user.username,
                        iconURL: interaction.member.user.avatarURL()
                    })
                    .setTimestamp()
                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setURL(interaction.member.user.avatarURL())
                        .setLabel("Avatar")
                        .setStyle(ButtonStyle.Link)
                    )
                    await interaction.editReply({ embeds: [embed2], components: [button] })
                }
            }
        })
    }
}