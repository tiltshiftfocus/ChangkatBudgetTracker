// src/utils/groupByDescription.ts

import { BudgetItem } from "@/types";


export const groupByCategory = (budgetItems: BudgetItem[]) => {
  const groupedData: { [key: string]: number } = {};

  budgetItems.forEach(item => {
    if (groupedData[item.category]) {
      groupedData[item.category] += parseFloat(item.amount);
    } else {
      groupedData[item.category] = parseFloat(item.amount);
    }
  });

  return groupedData;
};
