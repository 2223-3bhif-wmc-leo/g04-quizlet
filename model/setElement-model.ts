class SetElement {
    // Fields
    private readonly _id: number;
    private readonly _setid: number;
    private _word: String;
    private _definition: String;

    // Constructor

    constructor(id: number, setId: number, word: String, definition: String) {
        this._id = id;
        this._setid = setId;
        this._word = word;
        this._definition = definition;
    }

    // Getters

    getId(): number {
        return this._id;
    }

    getSetId(): number {
        return this._setid;
    }

    getWord(): String {
        return this._word;
    }

    getDefinition(): String {
        return this._definition;
    }

    // Setters

    setWord(word: String) {
        this._word = word;
    }

    setDefinition(definition: String) {
        this._definition = definition;
    }
}

export {SetElement}
