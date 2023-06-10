import {SetElement} from "./setElement-model";

class Set {
    // Fields

    private _id: number;
    private _userEmail: String;
    private _title: String;
    private _description: String;
    private _isPublic: boolean;
    private _content: SetElement[];

    // Constructor

    constructor(id:number, userEmail:String, title: String, description: String, isPublic: boolean, content: SetElement[]) {
        this._id = id;
        this._userEmail = userEmail;
        this._title = title;
        this._description = description;
        this._isPublic = isPublic;
        this._content = content;
    }

    // Getters

    getId(): number {
        return this._id;
    }

    getTitle(): String {
        return this._title;
    }

    getDescription(): String {
        return this._description;
    }

    getIsPublic(): boolean {
        return this._isPublic;
    }

    getContent(): SetElement[] {
        return this._content;
    }

    getUserEmail(): String {
        return this._userEmail;
    }

    // Setters

    setTitle(title: String) {
        this._title = title;
    }

    setUserEmail(userEmail: String) {
        this._userEmail = userEmail;
    }

    setDescription(description: String) {
        this._description = description;
    }

    setIsPublic(isPublic: boolean) {
        this._isPublic = isPublic;
    }

    setContent(content: SetElement[]) {
        this._content = content;
    }

    // Methods

    addSetElement(setElement: SetElement) {
        this._content.push(setElement);
    }

    removeSetElement(setElement: SetElement) {
        this._content.splice(this._content.indexOf(setElement), 1);
    }
}

export {Set}
