import { Injectable } from '@angular/core';
import { LocalAuthDatabase, LocalAuthRecord } from 'src/app/shared/models/local-auth.model';

@Injectable({
  providedIn: 'root'
})
export class PouchDbService {
  private dbPromise: Promise<LocalAuthDatabase> | null = null;

  async upsert(record: LocalAuthRecord): Promise<unknown> {
    const db = await this.getDb();
    return db.put(record);
  }

  async getById(id: string): Promise<LocalAuthRecord> {
    const db = await this.getDb();
    return db.get(id);
  }

  private getDb(): Promise<LocalAuthDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = import('pouchdb-browser').then(module => {
        const PouchDB = (module as any).default || module;
        return new PouchDB('aem_local_auth') as LocalAuthDatabase;
      });
    }

    return this.dbPromise;
  }
}
