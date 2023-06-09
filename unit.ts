import {Database, Statement} from "sqlite";
import {verbose} from "sqlite3";
import {DB} from "./data";

export class Unit {
    private db: Database | null;
    private readonly statements: Statement[];
    private completed: boolean = false;

    private constructor(public readonly readOnly: boolean) {
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
        const stmt = await this.db!.prepare(sql);
        if (bindings !== null) {
            await stmt!.bind(bindings);
        }
        this.statements.push(stmt);
        return stmt!;
    }

    public async complete(commit: boolean | null = null): Promise<void> {
        if (this.completed) {
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

export async function ensureSampleDataInserted(unit: Unit): Promise<void> {
    async function alreadyPresent(): Promise<boolean> {
        const checkStmt = await unit.prepare(`SELECT COUNT(email) AS COUNT FROM user`);
        const result = await checkStmt.get();
        const count = result['COUNT'];

        return count > 0;
    }

    async function insert(): Promise<void> {
        // Prepare insert statements
        const userInsertStmt = await unit.prepare(
            `INSERT INTO main.user (email, password)
             VALUES (?1, ?2)`
        );
        const setInsertStmt = await unit.prepare(
            `INSERT INTO main."set" (setid, useremail, title, description, ispublic)
             VALUES (?1, ?2, ?3, ?4, ?5)`
        );
        const setElementInsertStmt = await unit.prepare(
            `INSERT INTO main.setelement (elementid, setid, word, definition)
             VALUES (?1, ?2, ?3, ?4)`
        );

        // Insert sample data for User table
        const user = ["example@email.org", 'userpassword'];
        await userInsertStmt.bind({
            1: user[0],
            2: user[1]
        });
        await userInsertStmt.run();
        await userInsertStmt.reset();

        // Insert sample data for Set table
        const set = [1, "example@email.org", 'Sample Set', 'This is a sample set.', 1];
        await setInsertStmt.bind({
            1: set[0],
            2: set[1],
            3: set[2],
            4: set[3],
            5: set[4]
        });
        await setInsertStmt.run();
        await setInsertStmt.reset();

        // Insert sample data for SetElement table
        const setElement = [1, 1, 'Sample Word', 'This is a sample word definition.'];
        await setElementInsertStmt.bind({
            1: setElement[0],
            2: setElement[1],
            3: setElement[2],
            4: setElement[3]
        });
        await setElementInsertStmt.run();
        await setElementInsertStmt.reset();
    }

    if (!await alreadyPresent()) {
        await insert();
    }

    // Enable verbose db logging
    await verbose();
}
