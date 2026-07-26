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
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const axisColor = isDark ? '#7d8194' : '#868c9c';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
    const tooltipBg = isDark ? '#14161d' : '#ffffff';
    const tooltipBorder = isDark ? '#2a2d3a' : '#e3e5ee';
    const tooltipText = isDark ? '#f3f4f8' : '#14161f';

    return (
        <div className="analysis-chart-card">
            <h2 style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--font-size-md)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '16px'
            }}>
                Expense Trend
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: axisColor, fontSize: 12 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: axisColor, fontSize: 12 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '10px',
                            color: tooltipText,
                            fontSize: '13px',
                        }}
                        cursor={{ stroke: isDark ? 'rgba(131,133,245,0.3)' : 'rgba(79,70,229,0.2)', strokeWidth: 1.5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="totalExpense" name="Expense"
                        stroke="#8385f5"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: '#8385f5', strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}