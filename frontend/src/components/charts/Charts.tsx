'use client';

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface SalesData {
    date: string;
    sales: number;
    orders: number;
    revenue: number;
}

interface ChartProps {
    data: SalesData[];
    type?: 'line' | 'bar' | 'area';
    height?: number;
}

export function SalesChart({ data, type = 'line', height = 300 }: ChartProps) {
    const ChartComponent = type === 'bar' ? BarChart : type === 'area' ? AreaChart : LineChart;
    const DataComponent = type === 'bar' ? Bar : type === 'area' ? Area : Line;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ChartComponent data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <DataComponent
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    fill="#2563eb"
                    name="Revenue ($)"
                />
                <DataComponent
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    fill="#10b981"
                    name="Orders"
                />
            </ChartComponent>
        </ResponsiveContainer>
    );
}

interface CategoryData {
    name: string;
    value: number;
    percentage: number;
}

interface PieChartProps {
    data: CategoryData[];
    height?: number;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function CategoryPieChart({ data, height = 300 }: PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}

interface TrafficData {
    hour: string;
    visitors: number;
    pageViews: number;
}

interface TrafficChartProps {
    data: TrafficData[];
    height?: number;
}

export function TrafficChart({ data, height = 300 }: TrafficChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                    name="Visitors"
                />
                <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorPageViews)"
                    name="Page Views"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

interface ConversionData {
    stage: string;
    count: number;
    rate: number;
}

interface ConversionFunnelProps {
    data: ConversionData[];
    height?: number;
}

export function ConversionFunnel({ data, height = 300 }: ConversionFunnelProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" name="Users" />
            </BarChart>
        </ResponsiveContainer>
    );
}
