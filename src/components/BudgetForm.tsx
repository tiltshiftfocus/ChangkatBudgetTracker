// src/components/BudgetForm.tsx
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useBudget } from "@/contexts/BudgetContext";
import { BudgetEditItem, BudgetItem } from "@/types";
import { useConstant } from "@/contexts/ConstantContext";

interface BudgetFormProps {
    isFormOpen: boolean
    onComplete: () => void
}

const BudgetForm: React.FC<BudgetFormProps> = ({ isFormOpen, onComplete }) => {
    const { processForm, editingItem } = useBudget();
    const { CATEGORIES: categories } = useConstant();

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

    useEffect(() => {
        setCategory(categories[0])
    }, [categories.length])

    useEffect(() => {
        if (editingItem != undefined) {
            setCategory((editingItem as BudgetItem).category);
            setAmount((editingItem as BudgetItem).amount);
            setDate((editingItem as BudgetItem).date);
        }
    }, [editingItem]);

    useEffect(() => {
        if (!isFormOpen) {
            resetForm();
        }
    }, [isFormOpen])

    return (
        <form onSubmit={handleSubmit} className="p-2">
            <div className="flex flex-col md:flex-row gap-2 mb-2">
                <label className="form-control flex-1">
                    <div className="label">
                        <div className="label-text">Category</div>
                    </div>
                    <select
                        className="select select-bordered w-full max-w-xs"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {
                            categories.map((cat: string, index: number) =>
                                <option key={`${cat}_${index}`} value={cat}>{cat}</option>
                            )
                        }
                    </select>
                </label>
                <label className="form-control flex-1">
                    <div className="label">
                        <div className="label-text text-gray-400">Amount</div>
                    </div>
                    <input
                        type="number"
                        inputMode="decimal"
                        id="amount"
                        className="input input-bordered grow md:flex-1"
                        placeholder="e.g. 6.5"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        required
                    />
                </label>
                <label className="form-control flex-1">
                    <div className="label">
                        <div className="label-text text-gray-400">Date</div>
                    </div>
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
                </label>
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
