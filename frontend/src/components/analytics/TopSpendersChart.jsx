import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Cell
} from "recharts";

const BAR_COLORS = [
    "#8385f5",
    "#a2a4ff",
    "#7c6df2",
    "#6366f1",
    "#9d8bf7",
];

export function TopSpendersChart({ data }) {
    const chartHeight = Math.max(350, data.length * 45);
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
                Top Spenders
            </h2>

            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                        type="number"
                        tick={{ fill: axisColor, fontSize: 12 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="user"
                        width={80}
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
                        cursor={{ fill: isDark ? 'rgba(131,133,245,0.08)' : 'rgba(79,70,229,0.06)' }}
                    />
                    <Bar dataKey="totalSpend" name="Total Spend" radius={[0, 6, 6, 0]}>
                        {data.map((_, index) => (
                            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}