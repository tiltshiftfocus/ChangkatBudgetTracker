import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { BudgetEditItem, BudgetItem, BudgetItemsOverview, BudgetLimit } from "@/types";
import moment from "moment";
import { sortBy } from "@/utils/global";
import { useConstant } from "./ConstantContext";

interface BudgetContextType {
    isLoading: boolean
    selectedYearMonth: string
    budgetItems: BudgetItem[]
    budgetOverview: BudgetItemsOverview[]
    editingItem?: BudgetItem | BudgetEditItem
    budgetLimit: string
    totalBudget: string
    processForm: (item: BudgetItem | BudgetEditItem) => Promise<void>
    loadData: (yearMonth: string) => void,
    setSelectedYearMonth: (YM: string) => void
    setEditingItem?: (value: BudgetItem | BudgetEditItem | undefined) => void
    loadBudgetLimit: () => void,
    updateBudgetLimit: (limitValue: number) => Promise<void>,
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        API_URL,
        CURRENT_USER,
        GET_EXPENSE_API,
        EDIT_EXPENSE_API,
        ADD_EXPENSE_API,
        GET_LIMIT_API,
        EDIT_LIMIT_API
    } = useConstant();

    const [isLoading, setIsLoading] = useState(true);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
    const [budgetOverview, setBudgetOverview] = useState<BudgetItemsOverview[]>([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState(moment().format('YYYY-MM'));
    const [budgetLimit, setBudgetLimit] = useState('0');
    const [totalBudgetMonth, setTotalBudgetMonth] = useState('0');

    const [editingItem, setEditingItem] = useState<BudgetItem | BudgetEditItem | undefined>(undefined);

    const loadData = (yearMonth?: string) => {
        return new Promise<void>((resolve, _) => {
            if (!isLoading) {
                setIsLoading(true);
            }
            if (yearMonth == null) {
                yearMonth = selectedYearMonth
            }

            const currentMonthAndYear = moment().format('YYYY-MM');
            fetch(`${API_URL}/${GET_EXPENSE_API}?date=${moment(yearMonth, 'YYYY-MM').format('YYYY-MM-01')}&userID=${CURRENT_USER}`)
            .then(res => res.json())
            .then((data: any) => {
                if (selectedYearMonth == currentMonthAndYear) {
                    const total = data.reduce((acc: number, current: any) => acc + parseFloat(current.amount), 0);
                    setTotalBudgetMonth(total.toString());
                }
    
                const overview = buildOverview(data);
    
                setBudgetItems([...data]);
                setBudgetOverview([...overview]);
                setIsLoading(false);
                resolve();
            })
        })
    }

    const loadBudgetLimit = () => {
        return new Promise<void>((resolve, _) => {
            fetch(`${API_URL}/${GET_LIMIT_API}?userID=${CURRENT_USER}`)
            .then(res => res.json())
            .then((result: BudgetLimit) => {
                setBudgetLimit(result.amount);
                resolve();
            })
        });
    }

    const updateBudgetLimit = (limitValue: number) => {
        return new Promise<void>((resolve, reject) => {
            const postItem = {
                userID: CURRENT_USER,
                amount: limitValue.toString()
            };
    
            const headers = {
                'Content-Type': 'application/json'
            }
            fetch(`${API_URL}/${EDIT_LIMIT_API}`, { headers, method: 'POST', body: JSON.stringify(postItem) })
            .then(res => res.json())
            .then(result => {
                if (result['ResponseMetadata']['HTTPStatusCode'] == 200) {
                    setBudgetLimit(limitValue.toString());
                    resolve();
                } else {
                    reject();
                }
            })
        });
    }

    useEffect(() => {
        if (API_URL != '') {
            setIsLoading(true)
            Promise.all([loadData(), loadBudgetLimit()])
            .then(_ => {setIsLoading(false)});
        }
    }, [API_URL]);

    useEffect(() => {
        if (API_URL != '') {
            loadData(selectedYearMonth);
        }
    }, [selectedYearMonth]);

    const addBudgetItem = (item: BudgetItem) => {
        return new Promise<void>((resolve, _) => {
            const postItem = JSON.parse(JSON.stringify(item));
            postItem['userID'] = CURRENT_USER;
            postItem['amount'] = `${postItem['amount']}`;
    
            const headers = {
                'Content-Type': 'application/json'
            }
            fetch(`${API_URL}/${ADD_EXPENSE_API}`, { headers, method: 'POST', body: JSON.stringify(postItem) })
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
            postItem['userID'] = CURRENT_USER;
            postItem['amount'] = `${postItem['amount']}`;

            const headers = {
                'Content-Type': 'application/json'
            }
            fetch(`${API_URL}/${EDIT_EXPENSE_API}`, { headers, method: 'POST', body: JSON.stringify(postItem) })
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
            isLoading: isLoading,
            selectedYearMonth,
            budgetItems,
            budgetOverview,
            editingItem,
            budgetLimit,
            totalBudget: totalBudgetMonth,
            setSelectedYearMonth,
            processForm,
            loadData,
            setEditingItem,
            loadBudgetLimit,
            updateBudgetLimit
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