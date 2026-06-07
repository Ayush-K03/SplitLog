import express from 'express';
import { addExpense,checkIfUserBelongToGroup,showExpenses } from '../controllers/expenseController.js';
export const expenseRouter = express.Router();

expenseRouter.route("/:groupId/expenses")
    .post(checkIfUserBelongToGroup,addExpense)
    .get(checkIfUserBelongToGroup,showExpenses)