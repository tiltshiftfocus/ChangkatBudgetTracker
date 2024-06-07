import { useBudget } from "@/contexts/BudgetContext"
import { ReactNode } from "react"

interface DateSelectTitleProps {
    title: string
}

const DateSelectTitle: React.FC<DateSelectTitleProps & { children: ReactNode }> = ({ title, children }) => {
    const {
        selectedYearMonth,
        setSelectedYearMonth
    } = useBudget();
    
    return (
        <div className="h-full flex flex-col items-center p-4">
            <div className="w-full max-w-screen-md">
                <div className="flex justify-between items-center border border-blue-800 border-opacity-30 rounded-lg px-5 py-3 mb-2 bg-white dark:bg-gray-800">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <input type="month" className="input input-bordered" value={selectedYearMonth} onChange={(e) => setSelectedYearMonth(e.target.value)}/>
                </div>
                {children}
            </div>
        </div>
    )
}

export default DateSelectTitle;