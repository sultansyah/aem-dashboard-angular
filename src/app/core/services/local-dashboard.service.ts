import { Injectable } from '@angular/core';
import { DashboardResponse, UserItem } from 'src/app/features/dashboard/models/dashboard-response.model';
import { ChartItem } from 'src/app/shared/models/chart.model';
import { LocalDashboardRecord } from 'src/app/shared/models/local-dashboard.model';
import { PouchDbService } from '../storage/pouch-db.service';

@Injectable({
  providedIn: 'root'
})
export class LocalDashboardService {
  constructor(private pouchDbService: PouchDbService) { }

  async saveData(
    chartDonut: ChartItem[],
    chartBar: ChartItem[],
    tableUsers: UserItem[],
    fetchedAt = new Date().toISOString()
  ): Promise<void> {
    const recordId = this.getRecordId();

    try {
      const existing = await this.pouchDbService.getById<LocalDashboardRecord>(recordId);

      await this.pouchDbService.upsert({
        ...existing,
        chartDonut,
        chartBar,
        tableUsers,
        updatedAt: fetchedAt
      })
    } catch (error: any) {
      if (error?.status !== 404) throw error;

      await this.pouchDbService.upsert({
        _id: recordId,
        chartDonut,
        chartBar,
        tableUsers,
        updatedAt: fetchedAt
      })
    }
  }

  async getData(): Promise<DashboardResponse> {
    const recordId = this.getRecordId();

    try {
      const record = await this.pouchDbService.getById<LocalDashboardRecord>(recordId);

      return {
        success: true,
        chartDonut: record.chartDonut,
        chartBar: record.chartBar,
        tableUsers: record.tableUsers,
        isOfflineData: true,
        lastFetchedAt: record.updatedAt
      };
    } catch (error: any) {
      if (error?.status !== 404) {
        throw error;
      }

      throw new Error('Cannot connect to server and no offline dashboard data is available');
    }
  }

  private getRecordId(): string {
    return `dashboard:data`;
  }
}
