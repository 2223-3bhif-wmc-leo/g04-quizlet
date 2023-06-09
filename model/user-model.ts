import {Set} from "./set-model";

class User {
    // Fields

    private _email: String;
    private _password: String;
    private _sets: Set[];

    // Constructor

    constructor(email: String, password: String, sets: Set[]) {
        this._email = email;
        this._password = password;
        this._sets = sets;
    }

    // Getters

    getEmail(): String {
        return this._email;
    }

    getPassword(): String {
        return this._password;
    }

    getSets(): Set[] {
        return this._sets;
    }

    // Setters

    setEmail(email: String) {
        this._email = email;
    }

    setPassword(password: String) {
        this._password = password;
    }

    setSets(sets: Set[]) {
        this._sets = sets;
    }

    // Methods

    addSet(set: Set) {
        this._sets.push(set);
    }

    removeSet(set: Set) {
        this._sets = this._sets.filter(s => s.getId() !== set.getId());
    }
}

export {User}
