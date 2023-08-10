import { Client, GuildMember, WebhookClient } from 'discord.js';
import net from 'net'
// import { bot } from '../index'
import { getDBConnection } from '../db'

interface SocketData {
  auth?: string;
  funcname: string;
  args: any;
}

interface Args {
  guild: string;
  id: string;
  rank: string;
}

type SocketFunction = (args: any, socket: any) => Promise<void>;

interface SocketFunctions {
  [key: string]: SocketFunction;
}

interface Module {
  socketServer: () => void;
  functions: SocketFunctions;
}

export default function createModule(client): Module {
  const connectedSockets: Set<any> = new Set();

  function checkAuthKey(data: SocketData): boolean {
    if (!data || !data.auth || data.auth !== 'jebanieborsukacwelajebanego') return false;
    return true;
  }

  
  const server = net.createServer((socket: any) => {
    console.log('[API] Connected to api server');
    connectedSockets.add(socket);
    // client.emit('socketChange', connectedSockets);
    socket.on('data', (recdata: Buffer) => {
      try {
        const jsons = recdata.toString().split(';;');
        for (const json of jsons) {
          if (json.length <= 1) continue;
          let data: SocketData
          try {
            data  = JSON.parse(json);
          } catch {
            console.log('error')
          }
          const auth = checkAuthKey(data);
          if (!auth) {
            console.log('WRONG AUTH KEY');
            connectedSockets.delete(socket);
            socket.destroy();
          }
          if (!data.funcname) continue;
          module.functions[data.funcname](data.args, socket);
        }
      } catch (e) {
        const string = recdata.toString();
        console.log(e, string);
      }
    });
    socket.on('end', () => {
      console.log('[API] Connection lost from ' + socket.remoteAddress + ':' + socket.remotePort);
    });
    const addr = server.address();
    socket.write(JSON.stringify({ handshake: addr.address + addr.port + ' (' + addr.family + ')' }));
  });

  server.on('error', (err: any) => {
    console.log(err);
  });
  server.listen(6666, () => {
    console.log('[API] Server listening on port 6666');
  });

  const module: Module = {
    socketServer: () => {},
    functions: {
      test: async (args: any) => {
        console.log(args);
      },
      addRole: async (args: Args) => {
        let guild = client.guilds.cache.get(args.guild);
        let userId = args.id;
        let rank = args.rank;
        if (!guild || !userId || !rank) return;
        let member: GuildMember | undefined = guild.members.cache.get(userId);
        if (!member) return;
        if (member.roles.cache.has(rank)) return;
        member.roles.add(rank, 'Added by MTA server');
      },
      removeRole: async (args: Args) => {
        let guild = client.guilds.cache.get(args.guild);
        let userId = args.id;
        let rank = args.rank;
        if (!guild || !userId || !rank) return;
        let member: GuildMember | undefined = guild.members.cache.get(userId);
        if (!member) return;
        if (!member.roles.cache.has(rank)) return;
        member.roles.remove(rank, 'Removed by MTA server');
      },
      sendPremiumChatMessage: async (args: any) => {
        const guild = (await client).guilds.cache.get('1128333804772274256')
        const db = await getDBConnection()
        const nick = args.nick;
        const mtaUID = args.mtaUID;
        const text = args.text;
        let avatar: string;
        const [rows] = await db.query('SELECT * FROM `iq-discord` WHERE uid=?',[mtaUID])
        if (rows.length > 0) {
            const user = guild.members.cache.get(rows[0].discord_id)
            if (user) {
                avatar = user.user.avatarURL()
            }
        }

        //https://discord.com/api/webhooks/1131539395032383488/XYsNEwwKNPBSHVEcE27Eh9QcCJ83NvCvmoM2gUaILmL1j08GXtQl1tg_b4Wb4Cq_BCnA
        const premiumWebhook = new WebhookClient({ id: '1131539395032383488', token: 'XYsNEwwKNPBSHVEcE27Eh9QcCJ83NvCvmoM2gUaILmL1j08GXtQl1tg_b4Wb4Cq_BCnA' }, { allowedMentions: { parse: [], users: [], roles: [], repliedUser: false }});
        premiumWebhook.send({
            username: `${nick} [${mtaUID}]`,
            content: text,
            avatarURL: avatar
        });
      },
      sendAdminChatMessage: async (args: any) => {
        const guild = (await client).guilds.cache.get('1128333804772274256')
        const db = await getDBConnection()
        const nick = args.nick;
        const mtaUID = args.mtaUID;
        const text = args.text;
        const rank = args.rank;
        let avatar: string;
        const [rows] = await db.query('SELECT * FROM `iq-discord` WHERE uid=?',[mtaUID])
        if (rows.length > 0) {
            const user = guild.members.cache.get(rows[0].discord_id)
            if (user) {
                avatar = user.user.avatarURL()
            }
        }

        //https://discord.com/api/webhooks/1131898906855358514/5b8HB2tCOKQfY39BXw5iZHmG8SJwscQpndBzwg_9SuQF95NJF5qGGuavA1wDpS2sqpKd
        const premiumWebhook = new WebhookClient({ id: '1131898906855358514', token: '5b8HB2tCOKQfY39BXw5iZHmG8SJwscQpndBzwg_9SuQF95NJF5qGGuavA1wDpS2sqpKd' }, { allowedMentions: { parse: [], users: [], roles: [], repliedUser: false }});
        premiumWebhook.send({
            username: `(${rank}) ${nick} [${mtaUID}]`,
            content: text,
            avatarURL: avatar
        });
      },
    },
  };

  return module;
}
