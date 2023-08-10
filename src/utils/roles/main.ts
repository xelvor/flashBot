import { bot } from "../..";

export async function addRole(userID: string, roleID: string, guildID: string) {
    const guild = (await bot).guilds.cache.get(guildID);
    if (!guild) throw('Guild not found')
    if (!userID) throw('User not found');
    if (!roleID) throw('Role not found');
    
    const member = guild.members.cache.get(userID);
    member.roles.add(roleID);
}

export async function removeRole(userID: string, roleID: string, guildID: string) {
    const guild = (await bot).guilds.cache.get(guildID);
    if (!guild) throw('Guild not found')
    if (!userID) throw('User not found');
    if (!roleID) throw('Role not found');
    
    const member = guild.members.cache.get(userID);
    member.roles.remove(roleID);
}

export async function fetchRole(roleID: string, guildID: string) {
    const guild = (await bot).guilds.cache.get(guildID);
    if (!guild) throw('Guild not found')
    if (!roleID) throw('Role not found');
    
    return await guild.roles.fetch(roleID);
}