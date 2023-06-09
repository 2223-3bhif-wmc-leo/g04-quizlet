import {User} from "../model/user-model";
import {Unit} from "../unit";
import {ServiceBase} from "../service/service-base";

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
        const unit: Unit = await Unit.create(false);
        const stmt = await unit.prepare(`UPDATE user SET password = ? WHERE id = ?`,{
            1: user.getEmail(),
            2: user.getPassword()
        });
        await stmt.run();
    }

    public async insertUser(user: User): Promise<void> {

    }

    public async deleteUser(user: User): Promise<void> {

    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const unit: Unit = await Unit.create(true);
        const stmt = await unit.prepare(`SELECT email FROM user WHERE email = ?`,{
            1: email
        })
        return ServiceBase.getInstance().nullUndefined(await stmt.get<User>());
    }

    public async getAllUsers(): Promise<User[]> {
        return [new User("email", "password", [])];
    }
}

export {UserRepository};