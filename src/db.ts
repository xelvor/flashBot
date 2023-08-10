import * as mysql from 'mysql2/promise';
import { config } from './config'

let db: mysql.Connection | null;

async function createDBConnection(): Promise<mysql.Connection> {
    console.log('[MYSQL] Connecting');
    db = await mysql.createConnection({
        host: config.db_host,
        port: 3306,
        user: config.db_user,
        password: config.db_password,
        database: config.db_name,
        charset: 'utf8_general_ci'
    }).catch(error => {
        console.log(error);
        console.log('Błąd MySQL');
        throw error; // Rethrow the error to be caught by the caller.
    });

    if (db) console.log('[MySQL] Connected.');
    return db;
}

async function keepDBAlive() {
    try {
        if (db) {
            const query = await db.execute('SET character_set_results=utf8mb4');
        }
    } catch (error) {
        console.log('Błąd połączenia z bazą, ponowne łączenie...');
        if (db) {
            await db.end(); // Use 'end' to close the connection instead of 'destroy'.
            db = null;
        }
        await createDBConnection();
    }
}

async function getDBConnection(): Promise<mysql.Connection> {
    if (!db) {
        db = await createDBConnection();
    }
    return db;
}

export {
    createDBConnection,
    keepDBAlive,
    getDBConnection
};