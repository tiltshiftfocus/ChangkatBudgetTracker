import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BudgetProvider } from "./contexts/BudgetContext.tsx"
import { ConstantProvider } from "./contexts/ConstantContext.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConstantProvider>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </ConstantProvider>
  </React.StrictMode>,
)
