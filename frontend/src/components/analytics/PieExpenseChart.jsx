import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28"
];

export function PieExpenseChart({ data }) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <h2 className="font-semibold text-lg mb-4">
                Spending By Category
            </h2>

            <ResponsiveContainer width="100%" height={320}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="totalExpense"
                        nameKey="category"
                        outerRadius={110}
                    >

                        {
                            data.map((entry,index)=>(
                                <Cell
                                    key={index}
                                    fill={COLORS[index%COLORS.length]}
                                />
                            ))
                        }

                    </Pie>

                    <Tooltip/>
                    <Legend/>

                </PieChart>

            </ResponsiveContainer>

        </div>

    )

}