// src/pages/BudgetTracker.tsx
import React from 'react';
import MonthlyExpensesChart from "@/components/MonthlyExpenseChart";
import DateSelectTitle from "@/components/DateSelectTitle";

const BudgetOverview: React.FC = () => {
    return (
        <DateSelectTitle title="Overview">
            <div className="flex justify-center border border-blue-800 border-opacity-30 bg-white dark:bg-gray-800 rounded-lg p-3 max-h-96">
                <MonthlyExpensesChart />
            </div>
        </DateSelectTitle>
    );
};

export default BudgetOverview;
