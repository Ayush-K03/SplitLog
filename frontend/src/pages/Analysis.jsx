import {useState,useEffect} from "react"
import {ExpenseTrendChart} from "../components/analytics/ExpenseTrendChart";
import {PieExpenseChart} from "../components/analytics/PieExpenseChart";
import {TopSpendersChart} from "../components/analytics/TopSpendersChart";
import {showNotification} from "../helper_functions/toast_helper"
import axios from "axios"
axios.defaults.withCredentials = true;

export function ShowAnalysis ({value : groupData}){
    const [groupId, setGroupId] = useState("");  
    const currDate = new Date();
    const startOfCurrentMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1,0,0,0,0);
    const [startDate,setStartDate] = useState(startOfCurrentMonth);
    const [endDate,setEndDate] = useState(currDate);
    const [categoryData,setCategoryData] = useState([]);
    const [spendData,setSpendData] = useState([]);
    const [trendData,setTrendData] = useState([]);

    async function updateCharts(startDate,endDate,groupId){
        try{
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analysis`,
                {startDate: startDate.toISOString(),endDate:endDate.toISOString(),groupId});
            setCategoryData(res.data.categoryData||[]);
            setSpendData(res.data.spendData||[]);
            setTrendData(res.data.trendData||[]);
        }
        catch(err){
            console.log(err.response?.data.msg);
            showNotification("error","Analysis report making failed!")
        }
    }

    function handleDateChange (e){
        const changeRequested = Number(e.target.value)
        const now = new Date();
        setEndDate(now);

    if (changeRequested === -1) {
        setStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        setEndDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
    } else if (changeRequested === 0) {
        setStartDate(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
        setEndDate(now);
    } else {
        setStartDate(new Date(now.getFullYear(), now.getMonth() - changeRequested, 1, 0, 0, 0, 0));
        setEndDate(now);
    }
    }

    function handleGroupChange (e){
        setGroupId(e.target.value);
    }

    useEffect(()=>{updateCharts(startDate,endDate,groupId)},[startDate,endDate,groupId]);

    return (
    <div className="analysis-section">
        <h2 className="analysis-section-title">Expense Analytics</h2>

        {/* Controls row */}
        <div className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div className="analysis-controls">
                <div className="analysis-control-group">
                    <label className="form-label" htmlFor="chosenGroup">Group:</label>
                    <select
                        className="analysis-select"
                        name="group_id"
                        id="chosenGroup"
                        value={groupId}
                        onChange={handleGroupChange}
                    >
                        <option value="">All groups</option>
                        {groupData?.map((groupInfo)=>(
                        <option key={groupInfo.gId} value={groupInfo.gId}>{groupInfo.groupName}</option>
                    ))}
                    </select>
                </div>

                <div className="analysis-control-group">
                    <label className="form-label" htmlFor="dateChosen">Period:</label>
                    <select
                        className="analysis-select"
                        name="dateChose"
                        id="dateChosen"
                        defaultValue="0"
                        onChange={handleDateChange}
                    >
                        <option value="-1">Today</option>
                        <option value="0">This Month</option>
                        <option value="1">Last Month</option>
                        <option value="3">Last 3 Months</option>
                        <option value="6">Last 6 Months</option>
                        <option value="12">Last Year</option>
                    </select>
                </div>
            </div>
        </div>

        {trendData.length === 0 && categoryData.length === 0 && spendData.length === 0 ? (
        <div className="card">
            <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3 className="empty-state-title">No data for this period</h3>
                <p className="empty-state-description">Add expenses to see your analytics here.</p>
            </div>
        </div>
        ) : (
            <div className="analysis-charts-grid">
                <div className="analysis-chart-card">
                    <ExpenseTrendChart data={trendData}/>
                </div>
                <div className="analysis-chart-card">
                    <PieExpenseChart data={categoryData}/>
                </div>
                <div className="analysis-chart-card" style={{ gridColumn: '1 / -1' }}>
                    <TopSpendersChart data={spendData}/>
                </div>
            </div>
        )
        }
    </div>
)
}
