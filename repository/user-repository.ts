import {User} from "../model/user-model";
import {Unit} from "../unit";
import {RepositoryBase} from "./repository-base";

class UserRepository extends RepositoryBase {
    // Constructor

    public constructor(unit: Unit) {
        super(unit);
    }

    // Methods

    public async updateUser(user: User): Promise<void> {

    }

    public async insertUser(user: User): Promise<void> {

    }

    public async deleteUser(user: User): Promise<void> {

    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return new User("email", "password", []);
    }

    public async getAllUsers(): Promise<User[]> {
        return [new User("email", "password", [])];
    }
}

export {UserRepository};