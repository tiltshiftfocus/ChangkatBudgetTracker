import BudgetForm from "@/components/BudgetForm";
import BudgetList from "@/components/BudgetList";
import DateSelectTitle from "@/components/DateSelectTitle";
import { useBudget } from "@/contexts/BudgetContext";
import { BudgetItem } from "@/types";
import React, { useRef, useState } from 'react';


const BudgetItemsHome: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { setEditingItem } = useBudget();
    
    const formModal = useRef<HTMLDialogElement | null>(null);
    const showForm = () => {
        formModal.current?.showModal();
        setIsFormOpen(true);
    }

    const onItemClick = (item: BudgetItem) => {
        setEditingItem != undefined && setEditingItem({ ...item });
        showForm();
    }

    const onFormClose = () => {
        setEditingItem != undefined && setEditingItem(undefined);
        setIsFormOpen(false);
    }

    return (
        <>
            <div className="mb-10">
                <DateSelectTitle title="Items">
                    <BudgetList onItemClick={onItemClick} />
                </DateSelectTitle>
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
        </>
    );
};

export default BudgetItemsHome;
