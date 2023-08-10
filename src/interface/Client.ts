export interface Config {
    token: string,
    color: string,
    client_id: string,
    server_name: string,
    db_conn_string: string,
    db_user: string,
    db_password: string
}

export interface Options {
    intents: number,
    token: string,
    config: Config,
}