// src/components/BudgetList.tsx
import React from 'react';
import { useBudget } from "@/contexts/BudgetContext";
import { BudgetItem, BudgetItemsOverview } from "@/types";
import moment from "moment";

interface BudgetListProps {
	onItemClick: (item: BudgetItem) => void
}

const BudgetList: React.FC<BudgetListProps> = ({ onItemClick }) => {
	const {
		isLoading,
		budgetOverview,
	} = useBudget();

	return (
		<>
			<div className="border border-blue-800 border-opacity-30 rounded-lg p-3 shadow-md bg-white dark:bg-gray-800 mb-24">
				{
					!isLoading && budgetOverview.length == 0 &&
					<div className="flex justify-center">
						<h4>No Records</h4>
					</div>
				}
				{
					!isLoading && budgetOverview.length > 0 && budgetOverview.map((budgetGroup: BudgetItemsOverview, index: number) => (
						<React.Fragment key={`overview_${index}`}>
							<div tabIndex={index} className="collapse-open">
								<div className="collapse-title font-bold">
									{moment(budgetGroup.date, 'YYYY-MM-DD').format('MMM DD, YYYY')}
								</div>
								<div className="collapse-content">
									{
										budgetGroup.items.map(d =>
											<div
												key={d.expenseID}
												style={{ transition: 'padding 0.2s' }}
												className="flex justify-between dark:hover:bg-gray-600 hover:bg-gray-200 hover:p-1 hover:rounded-lg cursor-pointer"
												onClick={() => onItemClick(d)}
											>
												<span>{d.category}</span>
												<span className="text-lg font-bold">${parseFloat(d.amount).toFixed(2)}</span>
											</div>
										)
									}
								</div>
							</div>
							{
								index != budgetOverview.length - 1 &&
								<div className="divider divider-accent"></div>
							}
						</React.Fragment>
					))
				}
				{
					isLoading &&
					<div className="flex justify-center"><span className="loading loading-spinner loading-md"></span></div>
				}
			</div>
			{/* <ul className="list-none p-4 overflow-auto">
				{budgetOverview.map((item: BudgetItemsOverview, index) => (
					<li key={`${item.id}_${index}`} className="bg-white p-4 rounded-lg shadow mb-2 flex justify-between items-center">
						<span>{item.category}</span>
						<span className="font-bold">${item.amount.toFixed(2)}</span>
					</li>
				))}
			</ul> */}
		</>
	);
};

export default BudgetList;
