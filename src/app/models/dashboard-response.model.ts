export { ChartItem } from './chart.model';
import { ChartItem } from './chart.model';

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
