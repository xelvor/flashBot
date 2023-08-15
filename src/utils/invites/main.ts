import { GuildMember } from "discord.js"
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

export function getCountOfActualInvites(user: GuildMember) {
    let invites: number = 0;
    return invites
}