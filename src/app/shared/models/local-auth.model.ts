import { PouchDbDocument } from "./pouch-db.model";

export interface LocalAuthRecord extends PouchDbDocument {
    username: string;
    passwordHash: string;
    token: string;
    createdAt: string;
    updatedAt: string;
}
