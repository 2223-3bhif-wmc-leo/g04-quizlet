import {SetElement} from "../model/setElement-model";

class SetElementRepository {
    // Singleton

    private static instance: SetElementRepository;

    private constructor() {

    }

    public static getInstance(): SetElementRepository {
        if (!SetElementRepository.instance) {
            SetElementRepository.instance = new SetElementRepository();
        }

        return SetElementRepository.instance;
    }

    // Methods

    public async updateSetElement(setElement: SetElement): Promise<void> {

    }

    public async insertSetElement(setElement: SetElement): Promise<void> {

    }

    public async deleteSetElement(setElement: SetElement): Promise<void> {

    }

    public async getSetElementById(setElementId: number): Promise<SetElement> {

    }

    public async getSetElementsBySetId(setId: number): Promise<SetElement[]> {

    }
}

export {SetElementRepository};
