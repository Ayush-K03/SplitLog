import express from 'express';
import { addExpense,checkIfUserBelongToGroup,showExpenses, showIndiviualBalances, showSettlements, userExpenseAcrossGroups } from '../controllers/expenseController.js';
export const expenseRouter = express.Router();

expenseRouter.route("/:groupId/expenses")
    .post(checkIfUserBelongToGroup,addExpense)
    .get(checkIfUserBelongToGroup,showExpenses)

expenseRouter.route("/:groupId/balances")
    .get(checkIfUserBelongToGroup,showIndiviualBalances)
expenseRouter.route("/:groupId/settlements")
    .get(checkIfUserBelongToGroup,showSettlements)
expenseRouter.route("/summary")
    .get(userExpenseAcrossGroups)

