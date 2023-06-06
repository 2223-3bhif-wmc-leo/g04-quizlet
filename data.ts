import {open, Database, Statement} from "sqlite";
import {Database as Driver} from "sqlite3";

export const dbFileName = 'LibreLearn.db';

export class Unit {

    private db: Database | null;
    private readonly statements: Statement[];
    private completed = false;

    private constructor(public readonly readOnly: boolean)
    {
        this.db = null;
        this.statements = [];
    }

    private async init(): Promise<void> {
        this.db = await DB.createDBConnection();
        if (!this.readOnly) {
            await DB.beginTransaction(this.db);
        }
    }

    public async prepare(sql: string, bindings: any | null = null): Promise<Statement> {
        const stmt: Statement = await this.db!.prepare(sql);
        if (bindings !== null){
            await stmt!.bind(bindings);
        }
        this.statements.push(stmt);
        return stmt!;
    }

    public async complete(commit: boolean | null = null): Promise<void> {
        if(this.completed){
            return;
        }
        this.completed = true;
        if (commit !== null) {
            await (commit ? DB.commitTransaction(this.db!) : DB.rollbackTransaction(this.db!));
        } else if (!this.readOnly) {
            throw new Error('transaction has been opened, requires information if commit or rollback needed');
        }
        for (const stmt of this.statements) {
            await stmt.finalize();
        }
        await this.db!.close();
    }

    public static async create(readOnly: boolean): Promise<Unit> {
        const unit = new Unit(readOnly);
        await unit.init();
        return unit;
    }
}

export class DB {
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
            driver: Driver
        });
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

    public static async insertSampleData() {
        /*const db = await DB.createDBConnection();
        const stmt = await db.prepare(`INSERT or ignore INTO Plane (tailNo, model, manufacturer, capacity) VALUES (?1, ?2, ?3, ?4)`);
        for(const plane of [
            ["OE-LAA", "A320 Neo", "Airbus", 164],
            ["OE-LAB", "B737-800", "Boeing", 188],
            ["OE-LAC", "A319", "Airbus", 152],
            ["OE-LAD", "B787-900", "Boeing", 260],
            ["OE-LAE", "B737-800", "Boeing", 188],
            ["OH-LPE", "B777-200", "Boeing", 330]
        ]){
            await stmt.bind({
                1: plane[0],
                2: plane[1],
                3: plane[2],
                4: plane[3]
            });
            await stmt.run();
            await stmt.reset();
        }
        await stmt.finalize();
        const stmt2 = await db.prepare(`Insert or ignore into Airport (icao, name, country, runwayLength) values (?, ?, ?, ?)`);
        await stmt2.run("LOWL", "Blue Danube Airport Linz", "Austria", 9842);
        await stmt2.run("LOWW", "Vienna International Airport", "Austria", 11811);
        await stmt2.run("LIRF", "Leonardo da Vinci-Fiumicino", "Italy", 12795);
        await stmt2.run("EDDF", "Frankfurt", "Germany", 13123);
        await stmt2.run("EGLL", "Heathrow", "UK", 12802);
        await stmt2.run("RJAA", "Narita International", "Japan", 13123);
        await stmt2.run("KATL", "Hartsfield-Jackson Atlanta International", "USA", 12390);
        await stmt2.finalize();
        await db.run(`Insert or ignore into Flight (flightNo, departure, arrival, passengers, plane, departure_FK, arrival_FK) values (124, '2023-06-01 13:00:00', '2023-06-01 17:00:00', 150, 'OE-LAA', 'KORD', 'KDFW')`);
        await db.run(`Insert or ignore into Flight (flightNo, departure, arrival, passengers, plane, departure_FK, arrival_FK) values (125, '2024-06-01 13:00:00', '2024-06-01 17:00:00', 150, 'OE-LAA', 'KORD', 'KDFW')`);
        await db.close();*/
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        await connection.run(
            `create table if not exists User
             (
                 email       text not null,
                 password        text    not null,
                 constraint PK_User primary key (email)
             ) strict`
        );
        await connection.run(
            `create table if not exists VokabelSet
             (
                 vokabelSetId integer not null,
                 word         text    not null,
                 translation  text    not null,
                 constraint PK_Passenger primary key (vokabelSetId)
             ) strict`
        );
        await connection.run(
            `create table if not exists FullSet
             (
                 setId     integer not null,
                 setName   text    not null,
                 userEmail text    not null,
                 vokabList integer not null,
                 constraint PK_SET primary key (setId),
                 constraint FK_SET_USER foreign key (userEmail) references User (email) on delete cascade
             ) strict `
        );
        await connection.run(
            `create table if not exists VokabList
             (
                 listId       integer not null,
                 setId        integer not null,
                 vokabelSetId integer not null,
                 constraint PK_VokabList primary key (listId),
                 constraint FK_VokabList_VokabSet foreign key (vokabelSetId) references VokabelSet (vokabelSetId) on delete cascade,
                 constraint FK_VokabList_Set foreign key (setId) references FullSet (setId) on delete cascade
             ) strict`
        );
    }
}