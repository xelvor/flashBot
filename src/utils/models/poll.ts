import { Schema, model } from "mongoose";
import { IPoll } from "../../interface/Poll";

const pollSchema = new Schema<IPoll>({
    text: { type: String, required: true },
    //@ts-ignore
    data: { type: Array<Object>, required: true },
    token: { type: String, required: true },
    guild: { type: String, required: true },
})

export const Poll = model<IPoll>('Polls', pollSchema);