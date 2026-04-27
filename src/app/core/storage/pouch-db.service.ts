import { Injectable } from '@angular/core';
import { PouchDbDatabase, PouchDbDocument } from 'src/app/shared/models/pouch-db.model';

type PouchDbConstructor = new (name: string) => PouchDbDatabase;

@Injectable({
  providedIn: 'root'
})
export class PouchDbService {
  private dbPromise: Promise<PouchDbDatabase> | null = null;

  async upsert<TDocument extends PouchDbDocument>(record: TDocument): Promise<unknown> {
    const db = await this.getDb();
    return db.put(record);
  }

  async getById<TDocument extends PouchDbDocument>(id: string): Promise<TDocument> {
    const db = await this.getDb();
    return db.get(id) as Promise<TDocument>;
  }

  private getDb(): Promise<PouchDbDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = import('pouchdb-browser').then(module => {
        const moduleWithDefault = module as { default?: PouchDbConstructor };
        const PouchDB = moduleWithDefault.default ?? (module as PouchDbConstructor);

        return new PouchDB('_aem_local');
      });
    }

    return this.dbPromise;
  }
}
