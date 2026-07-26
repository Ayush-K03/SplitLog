import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#8385f5",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28"
];

export function PieExpenseChart({ data }) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tooltipBg = isDark ? '#14161d' : '#ffffff';
    const tooltipBorder = isDark ? '#2a2d3a' : '#e3e5ee';
    const tooltipText = isDark ? '#f3f4f8' : '#14161f';
    const legendColor = isDark ? '#a8adbb' : '#565b6d';

    return (
        <>
            <h2 style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--font-size-md)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '16px'
            }}>
                Spending By Category
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="totalExpense"
                        nameKey="category"
                        outerRadius={110}
                        strokeWidth={0}
                    >
                        {
                            data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))
                        }
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: '10px',
                            color: tooltipText,
                            fontSize: '13px',
                            boxShadow: isDark
                                ? '0 8px 24px rgba(0,0,0,0.45)'
                                : '0 8px 24px rgba(20,22,41,0.12)',
                            padding: '10px 14px',
                        }}
                        labelStyle={{
                            color: tooltipText,
                            fontWeight: 600,
                            marginBottom: '4px',
                        }}
                        itemStyle={{
                            color: tooltipText,
                            fontSize: '13px',
                            padding: '2px 0',
                        }}
                        formatter={(value) => [`₹${(value / 100).toFixed(2)}`]}
                    />
                    <Legend
                        wrapperStyle={{ color: legendColor, fontSize: '13px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </>
    )
}