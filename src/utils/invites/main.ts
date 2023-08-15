import { Guild, GuildMember } from "discord.js"
import { InviteM } from "../models/invite"

export function newInvite(inviter: string, invites: number, fake: number, leaves: number, actuall: number, code: string, guild: string, invitedUsers: object) {
    const invite = new InviteM({
        inviter: inviter,
        invites: invites,
        fake: fake,
        leaves: leaves,
        actuall: actuall,
        code: code,
        guild: guild,
        invitedUsers: invitedUsers
    })

    invite.save()
}

export async function getCountOfActualInvites(user: GuildMember, guild: Guild) {
    let userInvites: Array<object> = []
    console.log(guild.id, user.id)

    try {
        const data = await InviteM.find({ guild: guild.id, inviter: user.id });
        if (data) {
            userInvites.push(data)
        }
    } catch (error) {
        console.error(error);
    }

    let acutal: number = 0

    for (let invite of userInvites) {
        // console.log(invite[0].id)
        if (invite[0]) {
            acutal += invite[0].actuall;
        }
    }

    return acutal
}