import {Set} from "../model/set-model";

class SetRepository {
    // Singleton

    private static instance: SetRepository;

    private constructor() {

    }

    public static getInstance(): SetRepository {
        if (!SetRepository.instance) {
            SetRepository.instance = new SetRepository();
        }

        return SetRepository.instance;
    }

    // Methods
    public async updateSet(set: Set): Promise<void> {

    }

    public async insertSet(set: Set): Promise<void> {

    }

    public async deleteSet(set: Set): Promise<void> {

    }

    public async getSetById(setId: number): Promise<Set> {

    }

    public async getSetsByUserId(userId: number): Promise<Set[]> {

    }

    public async getSetsByTitle(title: string): Promise<Set[]> {

    }

    public async getAllSets(): Promise<Set[]> {

    }

    public async getPublicSets(): Promise<Set[]> {

    }
}

export {SetRepository};
