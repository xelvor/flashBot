import Command from '../base/Command';
import { bot } from '../index';
import { createCanvas, loadImage, registerFont } from 'canvas';

const font = './src/utils/fonts/Inter-SemiBold.ttf'

registerFont(font, { family: 'Inter' });

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'test2',
            description: 'asasdasdasdasdbot',
            owner: false,
            options: [
                {
                    name: 'text',
                    description: 'Example: {username} joined for the guild',
                    type: 3,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'choose a channel',
                    type: 7,
                    required: true
                },
                {
                    name: 'attachment',
                    description: 'choose a background of the image',
                    type: 11,
                    required: false
                }
            ],
            run: async (interaction: any, client: typeof bot) => {
                let text: string = interaction.options.getString('text');
                const channel = interaction.options.getChannel('channel');
                const attachment = interaction.options.getAttachment('attachment');
            
                let backgroundImage = await loadImage('https://cdn.discordapp.com/attachments/1142555551578980462/1142819801484505248/bg.png');
            
                const canvas = createCanvas(1100, 500);
                const ctx = canvas.getContext('2d');
            
                if (backgroundImage) {
                    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                } else {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                text = text.replace("{username}", `${interaction.member.user.username}`)
            
                ctx.fillStyle = '#E6E6E6';
                ctx.font = '32px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(text, 550, 400);
            
                const avatarSize = 250;
                const avatarX = 425;
                const avatarY = 95;
                const avatarRadius = avatarSize / 2;

                const userAvatar = await loadImage(interaction.member.user.displayAvatarURL({ format: 'png' }));
                
                ctx.beginPath();
                ctx.ellipse(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius + 5, avatarRadius + 5, 0, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(userAvatar, avatarX - 5, avatarY - 5, avatarSize + 10, avatarSize + 10);
                ctx.beginPath();
                ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                ctx.lineWidth = 9; 
                ctx.strokeStyle = '#E6E6E6';
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            
                const attachmentBuffer = canvas.toBuffer();
            
                await channel.send({
                    content: `asdd`,
                    files: [{
                        attachment: attachmentBuffer,
                        name: 'flashbot-welcome.png'
                    }]
                });
            
            }
        });
    }
}
