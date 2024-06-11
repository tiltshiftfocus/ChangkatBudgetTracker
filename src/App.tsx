import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import './App.css';
import BudgetOverview from "./pages/BudgetOverview";
import BudgetItemsHome from "./pages/BudgetItemsHome";
import { useConstant } from "./contexts/ConstantContext";
// import { useWebApp } from "@vkruglikov/react-telegram-web-app";
// import { useMemo } from "react";
// import { useEffect, useState } from "react";

const App = () => {
	const { API_URL } = useConstant();
	// const { initDataUnsafe } = useWebApp();
	// const [twaUser, setTwaUser] = useState('');

	// useEffect(() => {
	// 	if (Object.keys(initDataUnsafe).length == 0) {
	// 		setTwaUser('testuser');
	// 	} else if (initDataUnsafe != null && initDataUnsafe['user'] != null) {
	// 		setTwaUser(initDataUnsafe['user']['id']);
	// 	}
	// }, [])

	if (API_URL != '') {
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
	} else {
		return (
			<div className="flex justify-center">
				<span className="loading loading-spinner loading-md"></span>
			</div>
		)
	}
}

export default App
