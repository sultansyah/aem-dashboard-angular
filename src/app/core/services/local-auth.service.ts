import { Injectable } from '@angular/core';
import { LocalAuthRecord } from 'src/app/shared/models/local-auth.model';
import { PouchDbService } from '../storage/pouch-db.service';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  constructor(private pouchDbService: PouchDbService) { }

  async saveCredential(
    username: string,
    password: string,
    token: string
  ): Promise<void> {
    const normalizedUsername = this.normalizeUsername(username);
    const recordId = this.getRecordId(normalizedUsername);

    const passwordHash = await this.hashPassword(password);
    const now = new Date().toISOString();

    try {
      const existing = await this.pouchDbService.getById<LocalAuthRecord>(recordId);

      await this.pouchDbService.upsert({
        ...existing,
        username: normalizedUsername,
        passwordHash,
        token,
        updatedAt: now
      })
    } catch (error: any) {
      if (error?.status !== 404) throw error;

      await this.pouchDbService.upsert({
        _id: recordId,
        username: normalizedUsername,
        passwordHash,
        token,
        createdAt: now,
        updatedAt: now
      })
    }
  }

  async validateCredential(
    username: string,
    password: string
  ): Promise<string> {
    const normalizedUsername = this.normalizeUsername(username);
    const recordId = this.getRecordId(normalizedUsername);

    const passwordHash = await this.hashPassword(password);

    try {
      const record = await this.pouchDbService.getById<LocalAuthRecord>(recordId);
      if (record.passwordHash !== passwordHash) {
        throw new Error('INVALID_LOGIN');
      }

      return record.token;
    } catch (error: any) {
      if (error?.status !== 404) {
        throw error;
      }
      throw new Error('INVALID_LOGIN');
    }
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  private getRecordId(username: string): string {
    return `auth:${username}`;
  }

  private async hashPassword(password: string): Promise<string> {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(hashBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
