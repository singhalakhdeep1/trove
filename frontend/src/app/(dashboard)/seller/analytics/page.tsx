'use client';

import { useEffect, useState } from 'react';
import { SalesChart, CategoryPieChart, TrafficChart } from '@/components/charts/Charts';

export default function SellerAnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState('7d');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
    });

    const [salesData, setSalesData] = useState([
        { date: 'Mon', sales: 45, orders: 12, revenue: 2400 },
        { date: 'Tue', sales: 52, orders: 15, revenue: 3100 },
        { date: 'Wed', sales: 38, orders: 10, revenue: 2200 },
        { date: 'Thu', sales: 68, orders: 20, revenue: 4500 },
        { date: 'Fri', sales: 91, orders: 28, revenue: 6200 },
        { date: 'Sat', sales: 103, orders: 35, revenue: 7800 },
        { date: 'Sun', sales: 87, orders: 25, revenue: 5900 },
    ]);

    const [categoryData, setCategoryData] = useState([
        { name: 'Electronics', value: 4500, percentage: 35 },
        { name: 'Clothing', value: 3200, percentage: 25 },
        { name: 'Home & Garden', value: 2600, percentage: 20 },
        { name: 'Sports', value: 1500, percentage: 12 },
        { name: 'Books', value: 1000, percentage: 8 },
    ]);

    const [trafficData, setTrafficData] = useState([
        { hour: '00:00', visitors: 120, pageViews: 450 },
        { hour: '04:00', visitors: 80, pageViews: 280 },
        { hour: '08:00', visitors: 350, pageViews: 1200 },
        { hour: '12:00', visitors: 580, pageViews: 2100 },
        { hour: '16:00', visitors: 620, pageViews: 2400 },
        { hour: '20:00', visitors: 480, pageViews: 1800 },
    ]);

    useEffect(() => {
        // Fetch analytics data from API
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`/api/analytics/seller?range=${timeRange}`);
            const data = await response.json();
            setStats(data.stats || stats);
            setSalesData(data.salesData || salesData);
            setCategoryData(data.categoryData || categoryData);
            setTrafficData(data.trafficData || trafficData);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Seller Analytics</h1>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-gray-900">
                        ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 mt-2">↑ 12.5% from last period</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                    <div className="text-sm text-green-600 mt-2">↑ 8.2% from last period</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Avg. Order Value</div>
                    <div className="text-2xl font-bold text-gray-900">
                        ${stats.averageOrderValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600 mt-2">↑ 5.1% from last period</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-red-600 mt-2">↓ 1.3% from last period</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
                    <SalesChart data={salesData} type="area" height={300} />
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
                    <CategoryPieChart data={categoryData} height={300} />
                </div>

                {/* Traffic Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Store Traffic</h3>
                    <TrafficChart data={trafficData} height={300} />
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{1000 + i}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">Customer {i}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">Product {i}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">${(i * 50).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">2024-01-0{i}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
