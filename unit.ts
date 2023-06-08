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
        const checkStmt = await unit.prepare(""); // TODO: Prepare check statement
        const result = await checkStmt.get();
        const count = result['COUNT'];

        return count > 0;
    }

    async function insert(): Promise<void> {
        // Prepare insert statements
        // TODO: Prepare insert statements

        // Insert sample data
        // TODO: Insert sample data
    }

    if (!await alreadyPresent()) {
        await insert();
    }

    // Enable verbose db logging
    await verbose();
}
