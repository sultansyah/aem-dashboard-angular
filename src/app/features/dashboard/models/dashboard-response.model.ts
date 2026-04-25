export { ChartItem } from 'src/app/shared/models/chart.model';
import { ChartItem } from 'src/app/shared/models/chart.model';

export interface DashboardResponse {
    success: boolean;
    chartDonut: ChartItem[];
    chartBar: ChartItem[];
    tableUsers: UserItem[];
}

export interface UserItem {
    firstName: string;
    lastName: string;
    username: string;
}
