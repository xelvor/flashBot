export interface Config {
    token: string,
    color: string,
    client_id: string,
    server_name: string,
    mongo_db: string,
    owner_role: string
}

export interface Options {
    intents: number,
    token: string,
    config: Config,
}