export interface IUser{
    email: string,
    password: string
}
export interface ISet{
    setId: number,
    setName: string,
    userEmail: string,
    vokabList: number
}
export interface IVokabList{
    listId: number,
    setId: number,
    vokabelSetId: number
}
export interface IVokabelSet{
    vokabelSetId: number,
    word: string,
    translation: string
}