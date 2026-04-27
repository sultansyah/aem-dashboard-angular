export interface PouchDbDocument {
    _id: string;
    _rev?: string;
}

export interface PouchDbDatabase {
    get(id: string): Promise<PouchDbDocument>;
    put(record: PouchDbDocument): Promise<unknown>;
}