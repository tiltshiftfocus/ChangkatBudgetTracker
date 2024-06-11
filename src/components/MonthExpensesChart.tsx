// src/components/MonthlyExpensesChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { groupByCategory } from "@/utils/groupByCategory";
import { useBudget } from "@/contexts/BudgetContext";
import { chartCurrencyTooltip } from "@/utils/global";

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthExpensesChart: React.FC = () => {
  const { budgetItems } = useBudget();
  // Group and sum data by description
  const groupedData = groupByCategory(budgetItems);
  const labels = Object.keys(groupedData);
  const dataValues = Object.values(groupedData);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie data={data} options={chartCurrencyTooltip} />
  );
};

export default MonthExpensesChart;
