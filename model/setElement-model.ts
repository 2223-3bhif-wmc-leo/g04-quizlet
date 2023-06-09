class SetElement {
    // Fields
    private _id: number;
    private _word: String;
    private _definition: String;

    // Constructor

    constructor(id: number, word: String, definition: String) {
        this._id = id;
        this._word = word;
        this._definition = definition;
    }

    // Getters

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
