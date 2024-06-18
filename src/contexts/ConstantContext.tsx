import { useWebApp } from "@vkruglikov/react-telegram-web-app"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

interface ConstantContextType {
    API_URL: string
    CURRENT_USER: string
    GET_EXPENSE_API: string
    ADD_EXPENSE_API: string
    EDIT_EXPENSE_API: string
    GET_LIMIT_API: string
    EDIT_LIMIT_API: string
    CATEGORIES: string[]
}

const ConstantContext = createContext<ConstantContextType | undefined>(undefined);

export const ConstantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { initDataUnsafe } = useWebApp();

    const [ consts, setConsts ] = useState<ConstantContextType>({
        API_URL: '',
        CURRENT_USER: 'test_user_1',
        GET_EXPENSE_API: '',
        ADD_EXPENSE_API: '',
        EDIT_EXPENSE_API: '',
        GET_LIMIT_API: '',
        EDIT_LIMIT_API: '',
        CATEGORIES: [],
    });

    useEffect(() => {
        fetch(import.meta.env.VITE_CONSTANTS_FILE)
        .then(res => res.json())
        .then((res: ConstantContextType) => {
            setConsts({...res});
            if (Object.keys(initDataUnsafe).length > 0) {
                setConsts(prev => ({ ...prev, CURRENT_USER: initDataUnsafe['user']['username'] }))
            }
        });
    }, []);

    return (
        <ConstantContext.Provider value={consts}>
            { children }
        </ConstantContext.Provider>
    )
}

export const useConstant = (): ConstantContextType => {
    const context = useContext(ConstantContext);
    if (!context) {
        throw new Error('useConstant must be used within a ConstantProvider');
    }
    return context;
}