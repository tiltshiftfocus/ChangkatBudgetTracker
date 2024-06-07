import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { BudgetEditItem, BudgetItem, BudgetItemsOverview } from "@/types";
import { ADD_EXPENSE_URL, EDIT_EXPENSE_URL, GET_EXPENSE_URL } from "@/constants/apis";
import moment from "moment";
import { sortBy } from "@/utils/global";

interface BudgetContextType {
    selectedYearMonth: string
    budgetItems: BudgetItem[]
    budgetOverview: BudgetItemsOverview[]
    editingItem?: BudgetItem | BudgetEditItem
    processForm: (item: BudgetItem | BudgetEditItem) => Promise<void>
    loadData: (yearMonth: string) => void,
    setSelectedYearMonth: (YM: string) => void
    setEditingItem?: (value: BudgetItem | BudgetEditItem | undefined) => void
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
    const [budgetOverview, setBudgetOverview] = useState<BudgetItemsOverview[]>([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState(moment().format('YYYY-MM'));

    const [editingItem, setEditingItem] = useState<BudgetItem | BudgetEditItem | undefined>(undefined);

    const loadData = (yearMonth?: string) => {
        return new Promise<void>((resolve, _) => {
            if (yearMonth == null) {
                yearMonth = selectedYearMonth
            }
            fetch(`${GET_EXPENSE_URL}?date=${moment(yearMonth, 'YYYY-MM').format('YYYY-MM-01')}`)
            .then(res => res.json())
            .then((data: any) => {
                data = data.map((d: any) => {
                    d.amount = parseFloat(d.amount);
                    return d;
                });
    
                const overview = buildOverview(data);
    
                setBudgetItems([...data]);
                setBudgetOverview([...overview]);
                resolve();
            })
        })
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData(selectedYearMonth);
    }, [selectedYearMonth]);

    const addBudgetItem = (item: BudgetItem) => {
        return new Promise<void>((resolve, _) => {
            const postItem = JSON.parse(JSON.stringify(item));
            postItem['amount'] = `${postItem['amount']}`;
    
            const headers = {
                'Content-Type': 'application/json'
            }
            fetch(ADD_EXPENSE_URL, { headers, method: 'POST', body: JSON.stringify(postItem) })
            .then(res => res.json())
            .then(result => {
                if (result['ResponseMetadata']['HTTPStatusCode'] == 200) {
                    loadData();
                }
                resolve();
            })
        })
    }

    const editBudgetItem = (item: BudgetEditItem) => {
        return new Promise<void>((resolve, _) => {
            const postItem = JSON.parse(JSON.stringify(item));
            postItem['amount'] = `${postItem['amount']}`;
            const headers = {
                'Content-Type': 'application/json'
            }
            fetch(EDIT_EXPENSE_URL, { headers, method: 'POST', body: JSON.stringify(postItem) })
            .then(res => res.json())
            .then(result => {
                if (result['ResponseMetadata']['HTTPStatusCode'] == 200) {
                    loadData();
                }
                resolve();
            })
        })
    }

    const processForm = (item: BudgetItem | BudgetEditItem) => {
        return new Promise<void>((resolve, _) => {
            if (editingItem) {
                editBudgetItem(item as BudgetEditItem).then(_ => resolve());
            } else {
                addBudgetItem(item as BudgetItem).then(_ => resolve());
            }
        })
    }

    const buildOverview = (items: BudgetItem[]) => {
        const groups = items.reduce((groups: { [key: string]: BudgetItem[] }, budget: BudgetItem) => {
            if (!groups[budget.date]) {
                groups[budget.date] = [];
            }
            groups[budget.date].push(budget);
            return groups;
        }, {});

        const groupedArrays = Object.keys(groups).map((date) => ({
            date,
            items: (groups[date] as BudgetItem[])
        }))
        .concat()
        .sort(sortBy('date', 'desc'));

        return groupedArrays;
    }

    return (
        <BudgetContext.Provider value={{
            selectedYearMonth,
            budgetItems,
            budgetOverview,
            editingItem,
            setSelectedYearMonth,
            processForm,
            loadData,
            setEditingItem
        }}>
            {children}
        </BudgetContext.Provider>
    )
}

export const useBudget = (): BudgetContextType => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
}