import z from 'zod'
export const validationForDetailsInSignup = z.object({
    firstName:z.string().trim().min(1,"Name is too short.").max(30,"Name is too long !"),
    lastName:z.string().trim(),
    email:z.string().email(),
    password:z.string().min(8,"Password should be atleast 8 characters").max(60,"Password is too long...")
    // regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
});
export const validationForDetailsInLogin = z.object({
    email:z.string().email(),
    // password:z.string().min(8,"Password should be atleast 8 characters").max(60,"Password is too long...")
});

export const expenseCategories = z.enum(["Food", "Travel", "Shopping", "Entertainment", "Education", "Groceries", "Rent and Utilities", "Healthcare", "Subscriptions", "Other"]);
export const validationForExpenseCreation = z.object({
    description:z.string().trim().min(5,"Description is too short.").max(40,"Description is too long !"),
    amount:z.number().min(1,"Please enter a valid amount").positive(),
    splitAmong:z.array(z.string()).min(1,"Please select atleast one user to split the amount."),
    category: expenseCategories.default("Other"),
});

export const validationForGroupCreation = z.object({
    groupName: z.string().trim().min(5,"Group name too short. Ensure it is of 5 characters")
});

export const validationForSettlementCreation = z.object({
    groupId:z.string(),
    from:z.string(),
    to:z.string(),
    amount:z.number().min(1,"Please enter a valid amount").positive()
});
