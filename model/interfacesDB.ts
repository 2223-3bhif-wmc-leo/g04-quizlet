export interface setDb {
    setid: number,
    userEmail: string,
    title: string,
    description: string,
    ispublic: boolean
}

export interface userDb {
    email: string,
    password: string
}

export interface setelementDb {
    elementid: number,
    setid: number,
    word: string,
    definition: string
}