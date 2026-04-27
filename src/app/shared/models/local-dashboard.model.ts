import { UserItem } from "src/app/features/dashboard/models/dashboard-response.model";
import { ChartItem } from "./chart.model";
import { PouchDbDocument } from "./pouch-db.model";

export interface LocalDashboardRecord extends PouchDbDocument {
    chartDonut: ChartItem[];
    chartBar: ChartItem[];
    tableUsers: UserItem[];
    updatedAt: string;
}
