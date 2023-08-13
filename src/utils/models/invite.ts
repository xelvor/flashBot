import { Schema, model } from "mongoose";
import { IInvite } from '../../interface/Invite'

const inviteSchema = new Schema<IInvite>({
    inviter: { type: String, required: true },
    invites: { type: Number, required: true },
    fake: { type: Number, required: true },
    leaves: { type: Number, required: true },
    actuall: { type: Number, required: true },
    code: { type: String, required: true },
    guild: { type: String, required: true },
    //@ts-ignore
    invitedUsers: { type: Array<Object>, required: true },
})

export const InviteM = model<IInvite>('Invites', inviteSchema);