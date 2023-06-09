import {Database as Driver} from "sqlite3";
import {open, Database} from "sqlite";

const dbFileName: string = 'LibreLearn.db';

export class DB {

    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
            driver: Driver
        });
        await db.run('PRAGMA foreign_keys = ON;');

        await DB.ensureTablesCreated(db);

        return db;
    }

    public static async beginTransaction(connection: Database): Promise<void> {
        await connection.run('begin transaction;');
    }

    public static async commitTransaction(connection: Database): Promise<void> {
        await connection.run('commit;');
    }

    public static async rollbackTransaction(connection: Database): Promise<void> {
        await connection.run('rollback;');
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        await connection.run(`CREATE TABLE IF NOT EXISTS "user" (
            email   text NOT NULL,
            password text    NOT NULL,
            CONSTRAINT pk_user PRIMARY KEY (email)
        ) STRICT`);

        await connection.run(`CREATE TABLE IF NOT EXISTS "set" (
            setid integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            userEmail text NOT NULL,
            title text NOT NULL,
            description text NULL,
            ispublic integer NOT NULL,
            CONSTRAINT fk_set_user FOREIGN KEY (userEmail) REFERENCES "user" (email) ON DELETE CASCADE
        ) STRICT`);

        await connection.run(`CREATE TABLE IF NOT EXISTS "setelement" (
            elementid integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            setid     integer NOT NULL,
            word      text    NOT NULL,
            definition text    NOT NULL,
            CONSTRAINT fk_setelement_set FOREIGN KEY (setid) REFERENCES "set" (setid) ON DELETE CASCADE
        ) STRICT`);
    }
}
