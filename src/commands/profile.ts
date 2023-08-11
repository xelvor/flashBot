import { EmbedBuilder, HexColorString } from 'discord.js';
import Command from '../base/Command';
import { bot } from '../index'
import { config } from '../config';
import axios from 'axios';
import { toTimestamp } from '../utils/date/main';
import { User } from '../utils/models/user';
import { getBadgeIconByValue, getBadgeNameByValue } from '../utils/badges/main';

export default class adminrole extends Command {
    constructor() {
        super({
            name: 'profile',
            description: 'Choose a user',
            owner: false,
            options: [
                {
                    name: 'user',
                    description: 'Choice a user',
                    type: 6,
                    required: false
                }
            ],
            run: async (interaction: any, client: typeof bot) => {
                const embed: EmbedBuilder = new EmbedBuilder()
                .setDescription('Loading...')
                .setColor(config.color as HexColorString)
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })

                const interactionMember = interaction.options.getUser('user')
                let member: any;
                if (!interactionMember) {
                    member = interaction.member.user
                } else {
                    member = (await client).users.cache.get(interactionMember.id)
                }

                
                let activities = interaction.member?.presence?.activities || [];

                let presence = '';
  
                if(activities.find(e => e.name == 'Custom Status')) {
                    presence = `Opis/Status: ${presence} ${activities.find(e => e.name == 'Custom Status').state}`;
                }
                let activity = activities.find(e => e.name == 'Spotify');
                if(activity) {
                    if (presence == '') {
                        presence = `Słucha spotify: ${activity.details} w wykonaniu ${activity.state}`;
                    } else {
                        presence = `${presence}\nSłucha spotify: ${activity.details} w wykonaniu ${activity.state}`;
                    }
                }
                let anyOtherActivity = activities.find(e => e.name != 'Custom Status' && e.name != 'Spotify');
                if(anyOtherActivity) {
                    if (presence == '') {
                        presence = `${presence}\nW grze ${anyOtherActivity.name}: ${anyOtherActivity.details} ${anyOtherActivity.state}`;
                    } else {
                        presence = `${presence}\nW grze ${anyOtherActivity.name}: ${anyOtherActivity.details} ${anyOtherActivity.state}`;
                    }
                }

                const userData = await axios.get(`https://japi.rest/discord/v1/user/${member.id}`)
                const data = userData.data.data

                let nitro = data.public_flags_array.find((obj) => {
                    return obj === 'NITRO';
                });
                
                if (nitro) {
                    nitro = 'Yes'
                } else {
                    nitro = 'No'
                }

                let badges = []

                try {
                    const user = await User.findOne({ id: member.id });
                    if (user) {
                        const userbadges = user.badges;
                        // @ts-ignore
                        for (let badge of userbadges) {
                            badges.push({
                                name: getBadgeNameByValue(badge.value),
                                icon: getBadgeIconByValue(badge.value)
                            });
                        }
                    }
                } catch (error) {
                    console.error(error);
                }

                data.public_flags_array.map(x => {
                    if (x == 'NITRO') {
                        badges.push({
                            icon: '<:nitro:1139240003050934407>',
                            name: 'Discord nitro'
                        })
                    } else if (x == 'ACTIVE_DEVELOPER') {
                        badges.push({
                            icon: '<:developer:1139239941482741850>',
                            name: 'Active Developer'
                        })
                    } else if (x == 'HOUSE_BALANCE') {
                        badges.push({
                            icon: '<:1_:1139239945119211590>',
                            name: 'House Balance'
                        })
                    }
                })



                const embed2: EmbedBuilder = new EmbedBuilder()
                .setTitle(member.username)
                .setColor(config.color as HexColorString)
                .addFields(
                {
                    name: "<:user:1139222572295274657> Username",
                    value: `\`${member.username}\``
                },
                {
                    name: "<:tag:1139222570542059582> Tag",
                    value: `\`${member.discriminator}\``
                },
                {
                    name: "<:avatar:1139223731038855179> Avatar",
                    value: `[Link](${member.avatarURL()})`
                },
                {
                    name: "<:avatar:1139223731038855179> Banner",
                    value: `[Link](${data.bannerURL})`
                },
                {
                    name: "<:avatar:1139223731038855179> Account created",
                    value: `<t:${toTimestamp(member.createdAt)}:R>`
                },
                {
                    name: "<:avatar:1139223731038855179> Status",
                    value: `\`${presence}\``
                },
                {
                    name: "<:nitro:1139240003050934407> Nitro",
                    value: `\`${nitro}\``
                },
                {
                    name: "<:badges:1139228708989841458> Badges",
                    value: `${badges.map(x => `${x.icon} \`- ${x.name}\``).join('\n')}`
                }
                )
                .setTimestamp()
                .setFooter({
                    text: interaction.member.user.username,
                    iconURL: interaction.member.user.avatarURL()
                })
                await interaction.editReply({ embeds: [embed2] })
            }
        })
    }
}