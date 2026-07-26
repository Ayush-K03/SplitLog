import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

export function ExpenseTrendChart({ data }) {
    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-4">
                Expense Trend
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="totalExpense" name="Expense"
                        stroke="#8884d8"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}