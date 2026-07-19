import express from 'express';
import { addExpense,checkIfUserBelongToGroup,showExpenses, showIndiviualBalances, userExpenseAcrossGroups } from '../controllers/expenseController.js';
import { createSettledRecord ,showPastSettlementByUser,showSettlements} from '../controllers/settlementController.js';
export const expenseRouter = express.Router();

expenseRouter.route("/:groupId/expenses")
    .post(checkIfUserBelongToGroup,addExpense)
    .get(checkIfUserBelongToGroup,showExpenses)

expenseRouter.route("/:groupId/balances")
    .get(checkIfUserBelongToGroup,showIndiviualBalances)
expenseRouter.route("/:groupId/settlements")
    .get(checkIfUserBelongToGroup,showSettlements)
    .post(checkIfUserBelongToGroup,createSettledRecord)
expenseRouter.route("/summary")
    .get(userExpenseAcrossGroups)

expenseRouter.route("/past_settlements")
    .get(showPastSettlementByUser)
