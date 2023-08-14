import { Client } from "discord.js";
import { Guild } from "../models/guild";

export async function loadInvites(client: Client, guild: string) {
    
}

export function newGuild(id: string, name: string, data: Array<object>, owner: string, invite: string) {
    const guild = new Guild({
        name: name,
        id: id,
        data: data,
        owner: owner,
        invite: invite
    })

    guild.save()
}