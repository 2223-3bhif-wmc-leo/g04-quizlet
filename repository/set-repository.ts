import {Set} from "../model/set-model";
import {RepositoryBase} from "./repository-base";
import {Unit} from "../unit";
import {SetElementRepository} from "./setElement-repository";
import {SetElement} from "../model/setElement-model";
import {setDb} from "../model/interfacesDB";
import {Statement} from "sqlite";

class SetRepository extends RepositoryBase {
    // Constructor

    public constructor(unit: Unit) {
        super(unit);
    }

    // Methods
    public async updateSet(set: Set): Promise<boolean> {
        const stmt = await this.unit.prepare('UPDATE "Set" SET title = ?, description = ?, isPublic = ? WHERE setid = ?');
        await stmt.bind(set.getTitle(), set.getDescription(), set.getIsPublic(), set.getId());
        return await this.executeStmt(stmt);
    }

    public async insertSet(set: Set): Promise<boolean> {
        const stmt = await this.unit.prepare('INSERT INTO "Set" (userEmail, title, description, ispublic) VALUES (?, ?, ?, ?)');
        await stmt.bind(set.getUserEmail(), set.getTitle(), set.getDescription(), set.getIsPublic());
        return await this.executeStmt(stmt);
    }

    public async deleteSet(set: Set): Promise<boolean> {
        const stmt = await this.unit.prepare('DELETE FROM "Set" WHERE setid = ?');
        await stmt.bind(set.getId());
        return await this.executeStmt(stmt);
    }

    public async getSetById(setId: number): Promise<Set | null> {
        const setElementRepository = new SetElementRepository(this.unit);
        const stmt = await this.unit.prepare('SELECT setid, userEmail, title, description, ispublic FROM "Set" WHERE setid = ?');
        await stmt.bind(setId);
        const row: setDb | null = RepositoryBase.nullIfUndefined(await stmt.get<setDb>());

        if (row === null) {
            return null;
        }

        const setElements: SetElement[] = await setElementRepository.getSetElementsBySetId(setId);
        const set: Set = new Set(row.setid, row.userEmail, row.title, row.description, row.ispublic, setElements);
        await this.unit.complete();
        return set;
    }

    public async getSetsByUserId(userEmail: string): Promise<Set[] | null> {
        const stmt = await this.unit.prepare('SELECT setid, userEmail, title, description, ispublic FROM "Set" WHERE userEmail = ?');
        await stmt.bind(userEmail);
        const rows: setDb[] | null = RepositoryBase.nullIfUndefined(await stmt.all<setDb[]>());

        if (rows === null || rows.length === 0) {
            return null;
        }

        const sets: Set[] = [];
        for (let i = 0; i < rows.length; i++) {
            const setElementRepository = new SetElementRepository(this.unit);
            let setElements: SetElement[] | null = RepositoryBase.nullIfUndefined(await setElementRepository.getSetElementsBySetId(rows[i].setid));

            if (setElements === null) {
                setElements = [];
            }

            const set: Set = new Set(rows[i].setid, rows[i].userEmail, rows[i].title, rows[i].description, rows[i].ispublic, setElements);
            sets.push(set);
        }
        return sets;
    }

    public async getSetsByTitle(title: string): Promise<Set[] | null> {
        const stmt = await this.unit.prepare('SELECT setid, userEmail, title, description, ispublic FROM "Set" WHERE title = ?');
        await stmt.bind(title);
        const rows: setDb[] | null = RepositoryBase.nullIfUndefined(await stmt.all<setDb[]>());

        if (rows === null || rows.length === 0) {
            return null;
        }

        const sets: Set[] = [];
        for (let i = 0; i < rows.length; i++) {
            const setElementRepository = new SetElementRepository(this.unit);
            let setElements: SetElement[] | null = RepositoryBase.nullIfUndefined(await setElementRepository.getSetElementsBySetId(rows[i].setid));

            if (setElements === null) {
                setElements = [];
            }

            const set: Set = new Set(rows[i].setid, rows[i].userEmail, rows[i].title, rows[i].description, rows[i].ispublic, setElements);
            sets.push(set);
        }
        return sets;
    }

    public async getPublicSets(): Promise<Set[] | null> {
        const stmt: Statement = await this.unit.prepare('SELECT setid, userEmail, title, description, ispublic FROM "Set" WHERE ispublic = 1');
        const rows: setDb[] | null = RepositoryBase.nullIfUndefined(await stmt.all<setDb[]>());

        if (rows === null || rows.length === 0) {
            return null;
        }

        const sets: Set[] = [];
        for (let i = 0; i < rows.length; i++) {
            const setElementRepository: SetElementRepository = new SetElementRepository(this.unit);
            let setElements: SetElement[] | null = RepositoryBase.nullIfUndefined(await setElementRepository.getSetElementsBySetId(rows[i].setid));

            if (setElements === null) {
                setElements = [];
            }

            const set: Set = new Set(rows[i].setid, rows[i].userEmail, rows[i].title, rows[i].description, rows[i].ispublic, setElements);
            sets.push(set);
        }
        return sets;
    }
}

export {SetRepository};
