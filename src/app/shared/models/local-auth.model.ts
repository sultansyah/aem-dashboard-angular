export interface LocalAuthDatabase {
    get(id: string): Promise<LocalAuthRecord>;
    put(record: LocalAuthRecord): Promise<unknown>;
}

export interface LocalAuthRecord {
    _id: string;
    _rev?: string;
    username: string;
    passwordHash: string;
    token: string;
    createdAt: string;
    updatedAt: string;
}