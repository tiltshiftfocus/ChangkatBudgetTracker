// src/pages/BudgetTracker.tsx
import React, { useState } from 'react';
import MonthExpensesChart from "@/components/MonthExpensesChart";
import DateSelectTitle from "@/components/DateSelectTitle";
import YearExpensesChart from "@/components/YearExpensesChart";
import { useBudget } from "@/contexts/BudgetContext";

const BudgetOverview: React.FC = () => {
    const { selectedYearMonth } = useBudget();
    const [chartType, setChartType] = useState<'month' | 'year'>('year');
    
    return (
        <div className="h-full flex flex-col items-center p-4 mb-10">
            <div className="w-full max-w-screen-md">
                <DateSelectTitle title="Overview" />
                <div className="flex justify-center gap-2 items-center border border-blue-800 border-opacity-30 rounded-lg px-5 py-3 mb-2 bg-white dark:bg-gray-800">
                    <h4 className="font-bold">Chart Type:</h4>
                    <label className="swap">
                        <input type="checkbox" checked={chartType == 'month' ? true : false} onChange={() => setChartType(chartType == 'year' ? 'month' : 'year')} />
                        <div className="swap-on btn btn-accent">Month</div>
                        <div className="swap-off btn btn-accent">Year</div>
                    </label>
                </div>
                {
                    chartType == 'month' &&
                    <div className="flex justify-center border border-blue-800 border-opacity-30 bg-white dark:bg-gray-800 rounded-lg p-3 max-h-96">
                        <MonthExpensesChart />
                    </div>
                }
                {
                    chartType == 'year' &&
                    <div className="flex justify-center border border-blue-800 border-opacity-30 bg-white dark:bg-gray-800 rounded-lg p-3 max-h-full">
                        <YearExpensesChart date={`${selectedYearMonth}-01`} />
                    </div>
                }
            </div>
        </div>
    );
};

export default BudgetOverview;
