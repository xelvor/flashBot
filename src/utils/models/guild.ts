import { Schema, model } from "mongoose";
import { IGuild } from "../../interface/Guild";

const userSchema = new Schema<IGuild>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    //@ts-ignore
    data: { type: Array<Object>, required: true },
    owner: { type: String, required: true },
    invite: { type: String, required: true },
    premium: { type: Boolean, required: false },
})

export const Guild = model<IGuild>('Guilds', userSchema);