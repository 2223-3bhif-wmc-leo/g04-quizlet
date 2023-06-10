import {Set} from "../model/set-model";
import {RepositoryBase} from "./repository-base";
import {Unit} from "../unit";

class SetRepository extends RepositoryBase {
    // Constructor

    public constructor(unit: Unit) {
        super(unit);
    }

    // Methods
    public async updateSet(set: Set): Promise<void> {
        const unit = await Unit.create(false);
        try{
            const stmt = await unit.prepare('UPDATE "Set" SET title = ?, description = ?, isPublic = ? WHERE setid = ?');
            stmt.bind(set.getTitle(), set.getDescription(), set.getIsPublic(), set.getId());
            await this.executeStmt(stmt);
            await unit.complete(true);
        } catch (e) {
            await unit.complete(false);
        }
    }

    public async insertSet(set: Set): Promise<void> {
        const unit = await Unit.create(false);
        try{
            const stmt = await unit.prepare('INSERT INTO "Set" (userEmail, title, description, ispublic) VALUES (?, ?, ?, ?)');
            stmt.bind(set.getTitle(), set.getDescription(), set.getIsPublic());
            await this.executeStmt(stmt);
            await unit.complete(true);
        } catch (e) {
            await unit.complete(false);
        }
    }

    public async deleteSet(set: Set): Promise<void> {

    }

    public async getSetById(setId: number): Promise<Set> {
        return new Set(1, "title", "description", true, []);
    }

    public async getSetsByUserId(userId: number): Promise<Set[]> {
        return [new Set(1, "title", "description", true, [])];
    }

    public async getSetsByTitle(title: string): Promise<Set[]> {
        return [new Set(1, "title", "description", true, [])];
    }

    public async getAllSets(): Promise<Set[]> {
        return [new Set(1, "title", "description", true, [])];
    }

    public async getPublicSets(): Promise<Set[]> {
        return [new Set(1, "title", "description", true, [])];
    }
}

export {SetRepository};
