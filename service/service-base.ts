import {Unit} from "../unit";
import {Statement} from "sqlite";
import {SERVICE_UNAVAILABLE} from "http-status-codes";

export class ServiceBase {
    private static instance: ServiceBase;
    private constructor() {

    }
    public static getInstance(): ServiceBase {
        if (!ServiceBase.instance) {
            ServiceBase.instance = new ServiceBase();
        }

        return ServiceBase.instance;
    }
    public async executeStmt(stmt: Statement): Promise<[success: boolean, id: number | null]> {
        const result = await stmt.run();
        const id = await ServiceBase.getInstance().nullUndefined(result.lastID);
        return [result.changes === 1, id];
    }
    public nullUndefined<T>(entity: T | undefined): T | null{
        if (entity === undefined) {
            return null;
        }
        return entity;
    }

    public unwrapSingle<T>(obj: any | null | undefined, fieldName: string): T | null {
        obj = ServiceBase.getInstance().nullUndefined(obj);
        return obj === null ? null : <T>obj(fieldName);
    }

    public unwrapAll<T>(obj: any[], fieldName: string): T[] {
        return obj.map(o => <T>o[fieldName]);
    }
}