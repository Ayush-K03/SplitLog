import express from 'express';
import { deleteExpense, addExpense,checkIfUserBelongToGroup,showExpenses, showIndiviualBalances, userExpenseAcrossGroups } from '../controllers/expenseController.js';
import { getPendingSettlementList,approveSettlement,createSettledRecord ,showPastSettlementByUser,showSettlements} from '../controllers/settlementController.js';

import {groupIdValidity} from "../middleware/groupIdCheck.js";

export const expenseRouter = express.Router();

const subRouter = express.Router({mergeParams : true});
subRouter.use(groupIdValidity,checkIfUserBelongToGroup);

subRouter.route("/expenses")
    .post(addExpense)
    .get(showExpenses)

subRouter.route("/balances")
    .get(showIndiviualBalances)
subRouter.route("/settlements")
    .get(showSettlements)
    .post(createSettledRecord)



expenseRouter.route("/summary")
    .get(userExpenseAcrossGroups)

expenseRouter.route("/past_settlements")
    .get(showPastSettlementByUser)
expenseRouter.route("/deleteExpense")
    .put(deleteExpense)
expenseRouter.route("/:settlementId/approve")
    .patch(approveSettlement)
expenseRouter.route("/showPendingList")
    .post(getPendingSettlementList)
expenseRouter.use("/:groupId",subRouter)



