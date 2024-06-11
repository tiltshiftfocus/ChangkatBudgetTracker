import { useBudget } from "@/contexts/BudgetContext"

interface DateSelectTitleProps {
    title: string
}

const DateSelectTitle: React.FC<DateSelectTitleProps> = ({ title }) => {
    const {
        selectedYearMonth,
        setSelectedYearMonth
    } = useBudget();
    
    return (
        <div className="flex justify-between items-center gap-2 border border-blue-800 border-opacity-30 rounded-lg px-5 py-3 mb-2 bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold">{title}</h3>
            <input type="month" className="input input-bordered" value={selectedYearMonth} onChange={(e) => setSelectedYearMonth(e.target.value)}/>
        </div>
    )
}

export default DateSelectTitle;