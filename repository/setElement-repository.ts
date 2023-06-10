import {SetElement} from "../model/setElement-model";
import {Unit} from "../unit";
import {RepositoryBase} from "./repository-base";
import {setelementDb} from "../model/interfacesDB";

class SetElementRepository extends RepositoryBase {
    // Constructor

    public constructor(unit: Unit) {
        super(unit);
    }

    // Methods

    public async updateSetElement(setElement: SetElement): Promise<boolean> {
        const sql = "UPDATE setelement SET word = ?1, definition = ?2 WHERE elementid = ?3";
        const stmt = await this.unit.prepare(sql);
        await stmt.bind({
            1: setElement.getWord(),
            2: setElement.getDefinition()
        });

        return await this.executeStmt(stmt);
    }

    public async insertSetElement(setElement: SetElement): Promise<void> {
        const sql = "INSERT INTO setelement (elementid, setid, word, definition) VALUES (?1, ?2, ?3, ?4)";
        const stmt = await this.unit.prepare(sql);
        await stmt.bind({
            1: setElement.getId(),
            2: setElement.getSetId(),
            3: setElement.getWord(),
            4: setElement.getDefinition()
        });

        await this.executeStmt(stmt);
    }

    public async deleteSetElement(setElement: SetElement): Promise<void> {
        const sql = "DELETE FROM setelement WHERE elementid = ?1";
        const stmt = await this.unit.prepare(sql);
        await stmt.bind({
            1: setElement.getId()
        });

        await this.executeStmt(stmt);
    }

    public async getSetElementById(setElementId: number): Promise<SetElement | null> {
        const sql = "SELECT elementid, setid, word, definition FROM setelement WHERE elementid = ?1";
        const stmt = await this.unit.prepare(sql);
        await stmt.bind({
            1: setElementId
        });

        const dbSetElement: setelementDb | null = RepositoryBase.nullIfUndefined(await stmt.get<setelementDb>());

        if (dbSetElement === null) {
            return null;
        }

        return new SetElement(dbSetElement.elementid, dbSetElement.setid, dbSetElement.word, dbSetElement.definition);
    }

    public async getSetElementsBySetId(setId: number): Promise<SetElement[] | null> {
        const sql = "SELECT elementid, setid, word, definition FROM setelement WHERE setid = ?1";
        const stmt = await this.unit.prepare(sql);
        await stmt.bind({
            1: setId
        });

        const dbSetElement: setelementDb[] | null = RepositoryBase.nullIfUndefined(await stmt.all<setelementDb[]>());

        if (dbSetElement === null) {
            return null;
        }

        let setElements: SetElement[] = [];

        for (let i = 0; i < dbSetElement.length; i++) {
            setElements.push(new SetElement(
                dbSetElement[i].elementid,
                dbSetElement[i].setid,
                dbSetElement[i].word,
                dbSetElement[i].definition)
            );
        }

        return setElements;
    }
}

export {SetElementRepository};
