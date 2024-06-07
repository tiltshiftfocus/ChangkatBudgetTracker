import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import './App.css';
import BudgetOverview from "./pages/BudgetOverview";
import BudgetItemsHome from "./pages/BudgetItemsHome";

const App = () => {
	return (
		<Router>
			<div className="h-screen flex flex-col bg-gray-200 dark:bg-gray-800">
				<nav className="bg-blue-600 p-4 text-white">
					<div className="container mx-auto flex justify-between">
						<Link to="/" className="font-bold">Budget Items</Link>
						<Link to="/budget-overview" className="font-bold" >Overview</Link>
					</div>
				</nav>
				<div className="flex-grow overflow-auto">
					<Routes>
						<Route path="*" element={<BudgetItemsHome />} />
						<Route path="/" element={<BudgetItemsHome />} />
						<Route path="/budget-overview" element={<BudgetOverview />} />
					</Routes>
				</div>
			</div>
		</Router>
	)
}

export default App
