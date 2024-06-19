import { useBudget } from "@/contexts/BudgetContext";
import React, { useEffect, useState } from "react"

interface BudgetLimitFormProps {
    onComplete: () => void
}

const BudgetLimitForm: React.FC<BudgetLimitFormProps> = ({ onComplete }) => {
    const { budgetLimit, updateBudgetLimit } = useBudget();
    const [limit, setLimit] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateBudgetLimit(limit);
        onComplete();
    }

    useEffect(() => {
        setLimit(parseInt(budgetLimit));
    }, [budgetLimit]);

    return (
        <form onSubmit={handleSubmit}>
            <label className="form-control flex-1 mb-5">
                <div className="label">
                    <div className="label-text text-gray-400">Amount</div>
                </div>
                <input
                    type="number"
                    id="amount"
                    className="input input-bordered"
                    placeholder="e.g. 6"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    required
                />
            </label>
            <div className="w-full flex justify-end">
                <button type="submit" className="btn btn-success text-white shadow-md">
                    Save
                </button>
            </div>
        </form>
    )
}

export default BudgetLimitForm;