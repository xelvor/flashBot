export interface IInvite {
    inviter: string;
    invites: number;
    fake: number;
    leaves: number;
    actuall: number;
    code: string;
    guild: string;
    invitedUsers: Array<object>;
}