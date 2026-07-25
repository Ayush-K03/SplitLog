import {useState,useEffect} from "react"
import {ExpenseTrendChart} from "../components/analytics/ExpenseTrendChart";
import {PieExpenseChart} from "../components/analytics/PieExpenseChart";
import {TopSpendersChart} from "../components/analytics/TopSpendersChart";
import {showNotification} from "../helper_functions/toast_helper"
// import {StatCards} from "../components/analytics/StatCards"
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
            console.log(groupId)
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
<>
    <div>
        Stat Cards :
        {/* <StatCards /> */}
    </div>
    <div>
        <label>Choose a group : </label>
        <select name="group_id" id="chosenGroup" value ={groupId} onChange={handleGroupChange}>
            <option value="">All groups</option>
            {groupData?.map((groupInfo)=>(
            <option key = {groupInfo.gId} value={groupInfo.gId}>{groupInfo.groupName}</option>
        ))}
        </select>
    </div>
    <div>
        <label>Choose date range : </label>
        <select name="dateChose" id="dateChosen"  defaultValue="0" onChange ={handleDateChange} >
            <option value="-1">Today</option>
            <option value="0">This Month</option>
            <option value="1">Last Month</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last Year</option>
        </select>
    </div>
    {trendData.length === 0 && categoryData.length === 0 && spendData.length === 0 ? 
    (
    <div className="empty-state">
        <p>No expenses found for this period.</p>
        <p>Add an expense to see your analytics here.</p>
    </div>
    ) : (
        <div>
            Expense Analytics : 
            <ExpenseTrendChart data={trendData}/>
            <PieExpenseChart data={categoryData}/>
            <TopSpendersChart data={spendData}/>
        </div>
    )
    }
</>
)}
