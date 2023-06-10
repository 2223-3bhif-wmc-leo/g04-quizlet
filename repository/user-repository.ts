import {User} from "../model/user-model";
import {Unit} from "../unit";
import {RepositoryBase} from "./repository-base";
import {userDb} from "../model/interfacesDB";
import {SetRepository} from "./set-repository";
import {SetElementRepository} from "./setElement-repository";

class UserRepository extends RepositoryBase {
    // Constructor

    public constructor(unit: Unit) {
        super(unit);
    }

    // Methods

    public async updateUser(user: User): Promise<boolean> {
        const stmt = await this.unit.prepare('UPDATE "User" SET password = ?1 WHERE email = ?2',{
            1: user.getPassword(),
            2: user.getEmail()
        });
        return await this.executeStmt(stmt);
    }

    public async insertUser(user: User): Promise<boolean> {
        const stmt = await this.unit.prepare('INSERT INTO "User" (email, password) VALUES (?1, ?2)',{
            1: user.getEmail(),
            2: user.getPassword()
        });
        return await this.executeStmt(stmt);
    }

    public async deleteUser(user: User): Promise<boolean> {
        const stmt = await this.unit.prepare('DELETE FROM "User" WHERE email = ?1', user.getEmail());
        return await this.executeStmt(stmt);
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const setRepo = new SetRepository(this.unit);
        const stmt = await this.unit.prepare('SELECT email, password FROM "User" WHERE email = ?1', email);
        const result: userDb | null = RepositoryBase.nullIfUndefined(await stmt.get<userDb>());
        if(result === null){
            return null;
        }
        const set = await setRepo.getSetsByUserId(email);
        const user: User = new User(result.email, result.password, set === null ? [] : set);
        return user;
    }

    public async getAllUsers(): Promise<User[] | null> {
        const setRepo = new SetRepository(this.unit);
        const stmt = await this.unit.prepare('SELECT email, password FROM "User"');
        const result: userDb[] | null = RepositoryBase.nullIfUndefined(await stmt.all<userDb[]>());
        if(result === null || result.length === 0){
            return null;
        }
        const users: User[] = [];
        for(let i = 0; i < result.length; i++){
            const set = await setRepo.getSetsByUserId(result[i].email);
            const user: User = new User(result[i].email, result[i].password, set === null ? [] : set);
            users.push(user);
        }
        return users;
    }
}

export {UserRepository};