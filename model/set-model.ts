import {SetElement} from "./setElement-model";

class Set {
    // Fields

    private _title: String;
    private _description: String;
    private _isPublic: boolean;
    private _content: SetElement[];

    // Constructor

    constructor(title: String, description: String, isPublic: boolean, content: SetElement[]) {
        this._title = title;
        this._description = description;
        this._isPublic = isPublic;
        this._content = content;
    }

    // Getters

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

    // Setters

    setTitle(title: String) {
        this._title = title;
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
