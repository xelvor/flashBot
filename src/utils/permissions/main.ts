import { Client, Guild, GuildMember, PermissionResolvable } from "discord.js";
import { config } from "../../config";

export async function isPlayerHavePermissions(client: Client, user: string, guildID: string, permissions: PermissionResolvable) {
    const guild: Guild = (await client).guilds.cache.get(guildID)
    if (!guild) return;
    const member: GuildMember = guild.members.cache.get(user)
    return member.permissions.has(permissions)
}

export async function isPlayerHaveOwnerPermission(client: Client, user: string) {
    const guild: Guild = (await client).guilds.cache.get('1122947672765112361')
    if (!guild) return;
    const member: GuildMember = guild.members.cache.get(user)
    return member.roles.cache.has(config.owner_role)
}