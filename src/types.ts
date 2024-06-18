export interface BudgetLimit {
    amount: string
    userID: string
}

export interface BudgetItem {
    id: number
    category: string
    amount: string
    date: string
    userID: string
    expenseID: string
}

export type BudgetEditItem = Omit<BudgetItem, 'id' | 'userID'>;

export interface BudgetItemsOverview {
    date: string
    items: BudgetItem[]
}

export interface BudgetItemsOverviewAsMap {
    [key: string]: BudgetItem[]
}