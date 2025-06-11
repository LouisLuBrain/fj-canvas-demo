/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

import styles from './FJToast.module.css';

interface FJToastContextProps {
    showToast: (config: FJToastConfig) => void;
}

interface FJToastConfig {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export function FJToastProvider({ children }: { children: React.ReactNode }) {
    const [isShowing, setIsShowing] = useState(false);
    const [toastConfig, setToastConfig] = useState<FJToastConfig | null>(null);

    const showToast = (config: FJToastConfig) => {
        setIsShowing(true);
        setToastConfig(config);
    };

    useEffect(() => {
        if (isShowing) {
            setTimeout(() => {
                setIsShowing(false);
            }, toastConfig?.duration || 3000);
        }
    }, [isShowing, toastConfig]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {isShowing && toastConfig?.message && (
                <div className={`${styles.toast} ${styles[toastConfig?.type || 'success']}`}>
                    {toastConfig?.message}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export const ToastContext = createContext<FJToastContextProps>({
    showToast: () => {},
});

export const useToast = () => {
    return useContext(ToastContext);
};
