import {User} from "../model/user-model";

class UserRepository {
    // Singleton

    private static instance: UserRepository;

    private constructor() {

    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }

        return UserRepository.instance;
    }

    // Methods

    public async updateUser(user: User): Promise<void> {

    }

    public async insertUser(user: User): Promise<void> {

    }

    public async deleteUser(user: User): Promise<void> {

    }

    public async getUserByEmail(email: String): Promise<User> {

    }
}

export {UserRepository};