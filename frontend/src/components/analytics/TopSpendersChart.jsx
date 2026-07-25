import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
export function TopSpendersChart({ data }) {
    const chartHeight = Math.max(350, data.length * 45);

    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-4">
                Top Spenders
            </h2>

            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="user"
                        width={80}
                    />
                    <Tooltip />
                    <Bar dataKey="totalSpend" name="Total Spend" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}