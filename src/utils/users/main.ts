import { User } from "../models/user";

export function newUser(username: string, id: string, discriminator: string, money: number, bank_money: number, badges: object) {
    const user = new User({
        username: username,
        tag: discriminator,
        id: id,
        money: money,
        bank_money: bank_money,
        badges: badges
    })

    user.save()
}