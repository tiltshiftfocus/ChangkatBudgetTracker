import BudgetForm from "@/components/BudgetForm";
import BudgetLimitForm from "@/components/BudgetLimitForm";
import BudgetList from "@/components/BudgetList";
import DateSelectTitle from "@/components/DateSelectTitle";
import { useBudget } from "@/contexts/BudgetContext";
import { BudgetItem } from "@/types";
import { formatCurrency } from "@/utils/global";
import React, { useMemo, useRef, useState } from 'react';


const BudgetItemsHome: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { isLoading, setEditingItem, budgetLimit, totalBudget } = useBudget();
    
    const formModal = useRef<HTMLDialogElement | null>(null);
    const showForm = () => {
        formModal.current?.showModal();
        setIsFormOpen(true);
    }

    const budgetLimitModal = useRef<HTMLDialogElement | null>(null);

    const onItemClick = (item: BudgetItem) => {
        setEditingItem != undefined && setEditingItem({ ...item });
        showForm();
    }

    const onFormClose = () => {
        setEditingItem != undefined && setEditingItem(undefined);
        setIsFormOpen(false);
    }

    const budgetSoFar = useMemo(() => {
        const value = (parseFloat(totalBudget) / parseFloat(budgetLimit)) * 100;
        const progressClass = (() => {
            if (value > 0 && value <= 50) {
                return 'progress-success';
            } else if (value > 50 && value <= 70) {
                return 'progress-warning';
            } else {
                return 'progress-error';
            }
        })();

        return (
            {
                value,
                progressClass
            }
        )
    }, [budgetLimit, totalBudget]);

    return (
        <>
            <div className="h-full flex flex-col items-center p-4 mb-10">
                {/* {Intl.NumberFormat('en-US', { style: 'currency', currency: 'SGD', currencyDisplay: 'narrowSymbol' }).format(parseInt(budgetLimit))} */}
                <div className="w-full max-w-screen-md">
                    {
                        <div className="flex flex-col justify-between items-center gap-2 border border-blue-800 border-opacity-30 rounded-lg px-5 py-3 mb-2 bg-white dark:bg-gray-800">
                            {
                                !isLoading && parseInt(budgetLimit) > 0 &&
                                <>
                                <span className="mt-10 mb-5 text-center">
                                    You have spent <span className="font-bold">{ formatCurrency(totalBudget) }</span> out of { formatCurrency(budgetLimit) }.
                                </span>
                                <progress className={`mb-10 progress ${budgetSoFar.progressClass} sm:w-96 w-48`} value={budgetSoFar.value} max="100"></progress>
                                </>
                            }
                            {
                                !isLoading && parseInt(budgetLimit) == 0 &&
                                <small className="mt-10 mb-5 text-center">
                                    You have not set a budget limit. Click below to set one.
                                </small>
                            }
                            {
                                isLoading &&
                                <span className="loading loading-spinner loading-md"></span>
                            }
                            <div className="flex justify-end w-full">
                                <small className="cursor-pointer" onClick={() => budgetLimitModal.current?.show()}>Set/Edit Limit</small>
                            </div>
                        </div>
                    }
                    {
                        
                    }
                    <DateSelectTitle title="Items"/>
                    <BudgetList onItemClick={onItemClick} />
                </div>
            </div>
            <button className="btn btn-accent shadow-lg fixed bottom-5 right-5" onClick={showForm}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <g transform="translate(10, -5) rotate(45)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </g>
                </svg>
                New Transaction
            </button>
            <dialog ref={formModal} className="modal modal-lg" onClose={onFormClose}>
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="mt-4">
                        <BudgetForm isFormOpen={isFormOpen} onComplete={() => formModal.current?.close()}/>
                    </div>
                </div>
            </dialog>
            <dialog ref={budgetLimitModal} className="modal modal-lg">
                <div className="modal-box w-11/12">
                    <form method="dialog" className="flex justify-between items-center">
                        <h5 className="text-xl">Edit Budget Limit</h5>
                        <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                    </form>
                    <div className="mt-4">
                        <BudgetLimitForm onComplete={() => budgetLimitModal.current?.close()} />
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default BudgetItemsHome;
