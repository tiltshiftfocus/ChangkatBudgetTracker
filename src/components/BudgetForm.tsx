// src/components/BudgetForm.tsx
import React, { useState } from 'react';
import moment from 'moment';
import { useBudget } from "@/contexts/BudgetContext";
import { BudgetEditItem, BudgetItem } from "@/types";

interface BudgetFormProps {
    isFormOpen: boolean
    onComplete: () => void
}

const BudgetForm: React.FC<BudgetFormProps> = ({ isFormOpen, onComplete }) => {
    const { processForm, editingItem } = useBudget();
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category && amount) {
            // create mode
            let data: BudgetItem | BudgetEditItem = {
                id: Date.now(),
                category: category,
                amount: Number(amount),
                date,
                userID: 'gy',
                expenseID: `${moment().unix()}-gy`
            };
            
            // edit mode: replace `data`
            if (editingItem != undefined) {
                data = {
                    category: category,
                    amount: Number(amount),
                    expenseID: editingItem.expenseID,
                    date: editingItem.date
                }
            }
            
            processForm(data).then(_ => {
                resetForm();
                onComplete();
            });
        }
    };

    const resetForm = () => {
        setCategory('');
        setAmount('');
        setDate(moment().format('YYYY-MM-DD'));
    }

    React.useEffect(() => {
        if (editingItem != undefined) {
            setCategory((editingItem as BudgetItem).category);
            setAmount((editingItem as BudgetItem).amount);
            setDate((editingItem as BudgetItem).date);
        }
    }, [editingItem]);

    React.useEffect(() => {
        if (!isFormOpen) {
            resetForm();
        }
    }, [isFormOpen])

    return (
        <form onSubmit={handleSubmit} className="p-2">
            <div className="flex flex-col md:flex-row gap-2 mb-2">
                <label className="input input-bordered flex items-center gap-2">
                    <span className="text-gray-400">Category</span>
                    <input
                        type="text"
                        id="category"
                        className="grow md:flex-1"
                        placeholder="e.g Lunch"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <span className="text-gray-400">Amount</span>
                    <input
                        type="number"
                        inputMode="decimal"
                        id="amount"
                        className="grow md:flex-1"
                        placeholder="e.g. 6.5"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        required
                    />
                </label>
                <input
                    disabled={editingItem != undefined}
                    type="date"
                    id="date"
                    className="input input-bordered md:flex-1"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div className="w-full flex justify-end">
                <button type="submit" className="btn btn-success text-white shadow-md">
                    {editingItem != undefined ? 'Edit' : 'Add'} Item
                </button>
            </div>
        </form>
    );
};

export default BudgetForm;
