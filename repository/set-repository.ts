import {Set} from "../model/set-model";
import {RepositoryBase} from "./repository-base";
import {Unit} from "../unit";
import {SetElementRepository} from "./setElement-repository";
import {SetElement} from "../model/setElement-model";
import {setDb} from "../model/interfacesDB";

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

    public async getSetsByUserId(userId: number): Promise<Set[] | null> {
        return null;
    }

    public async getSetsByTitle(title: string): Promise<Set[]> {
        return [new Set(1, "a@b.c","title", "description", true, [])];
    }

    public async getAllSets(): Promise<Set[]> {
        return [new Set(1, "a@b.c","title", "description", true, [])];
    }

    public async getPublicSets(): Promise<Set[]> {
        return [new Set(1, "a@b.c","title", "description", true, [])];
    }
}

export {SetRepository};
