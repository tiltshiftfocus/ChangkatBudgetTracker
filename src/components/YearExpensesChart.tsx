// src/components/YearExpenseChart.tsx
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useConstant } from "@/contexts/ConstantContext";
import { chartCurrencyTooltip } from "@/utils/global";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface YearExpensesChartProps {
    date: string
}

const YearExpensesChart: React.FC<YearExpensesChartProps> = ({ date }) => {
    const { API_URL, CURRENT_USER, GET_EXPENSE_API } = useConstant();
    
    const [chartData, setChartData] = useState<any>({});
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));

    const updateChart = () => {
        fetch(`${API_URL}/${GET_EXPENSE_API}?date=${date}&sort_type=year&userID=${CURRENT_USER}`)
        .then(res => res.json())
        .then((items: any) => {
            const yearExpenses = new Array(12).fill(0);
            items.forEach((item: any) => {
                const month = new Date(item.date).getMonth();
                yearExpenses[month] += parseFloat(item.amount);
            });
            const data = {
                labels: months,
                datasets: [
                    {
                        label: 'Total',
                        data: yearExpenses,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                ]
            };
            setChartData({...data});
        });
    }
    
    useEffect(() => {
        updateChart()
    }, [date]);

    if (Object.keys(chartData).length == 0) {
        return (<></>)
    } else {
        return <Bar data={chartData} options={chartCurrencyTooltip} />;
    }
};

export default YearExpensesChart;
