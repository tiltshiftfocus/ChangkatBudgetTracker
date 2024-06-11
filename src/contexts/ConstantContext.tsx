import { ReactNode, createContext, useContext, useEffect, useState } from "react"

interface ConstantContextType {
    API_URL: string
    GET_EXPENSE_API: string
    ADD_EXPENSE_API: string
    EDIT_EXPENSE_API: string
    CATEGORIES: string[]
}

const ConstantContext = createContext<ConstantContextType | undefined>(undefined);

export const ConstantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ consts, setConsts ] = useState<ConstantContextType>({
        API_URL: '',
        GET_EXPENSE_API: '',
        ADD_EXPENSE_API: '',
        EDIT_EXPENSE_API: '',
        CATEGORIES: [],
    });

    useEffect(() => {
        fetch('/constants.json')
        .then(res => res.json())
        .then((res: ConstantContextType) => setConsts({...res}));
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