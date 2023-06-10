import {SetElement} from "../model/setElement-model";
import {Unit} from "../unit";
import {RepositoryBase} from "./repository-base";

class SetElementRepository extends RepositoryBase {
    // Constructor

    public constructor(unit: Unit) {
        super(unit);
    }

    // Methods

    public async updateSetElement(setElement: SetElement): Promise<void> {

    }

    public async insertSetElement(setElement: SetElement): Promise<void> {

    }

    public async deleteSetElement(setElement: SetElement): Promise<void> {

    }

    public async getSetElementById(setElementId: number): Promise<SetElement> {
        return new SetElement(1, "word", "definition");
    }

    public async getSetElementsBySetId(setId: number): Promise<SetElement[]> {
        return [new SetElement(1, "word", "definition")];
    }
}

export {SetElementRepository};
