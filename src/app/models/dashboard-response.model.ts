export interface DashboardResponse {
    success: boolean;
    chartDonut: ChartItem[];
    chartBar: ChartItem[];
    tableUsers: UserItem[];
}

export interface ChartItem {
    name: string;
    value: number;
}

export interface UserItem {
    firstName: string;
    lastName: string;
    username: string;
}