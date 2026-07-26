export function ShowCards({value:totalExpenseResult,count :expenseCountResult}){
    return(
        <>
            <div>
                Your Total Expense :
                {(totalExpenseResult)}
            </div>
            <div>
                Total Number Of Expenses :
                {(expenseCountResult)}
            </div>
        </>
    )
}