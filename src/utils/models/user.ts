import { Schema, model } from "mongoose";
import { IUser } from "../../interface/User";

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    tag: { type: String, required: true },
    id: { type: String, required: true },
    money: { type: Number, required: true },
    bank_money: { type: Number, required: true },
    badges: { type: Object, required: true },
    invites: { type: Object, required: true },
})

export const User = model<IUser>('Users', userSchema);