export function ShowCards({ value: totalExpenseResult, count: expenseCountResult }) {
    return (
        <div className="stat-cards-row">
            <div className="stat-card">
                <div className="stat-card-label">Total Spent</div>
                <div className="stat-card-value">₹{(totalExpenseResult / 100).toFixed(2)}</div>
                <div className="stat-card-icon">💸</div>
            </div>
            <div className="stat-card">
                <div className="stat-card-label">No. of Expenses</div>
                <div className="stat-card-value">{expenseCountResult}</div>
                <div className="stat-card-icon">🧾</div>
            </div>
        </div>
    )
}