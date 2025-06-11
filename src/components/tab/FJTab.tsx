import styles from './FJTab.module.css';

export interface Tab {
    label?: string;
    value?: string;
    icon?: React.ReactNode;
}

interface FJTabProps {
    tabs: Tab[];
    currentTab?: Tab;
    onTabChange?: (tab: Tab) => void;
}

export default function FJTab({ tabs, currentTab, onTabChange }: FJTabProps) {
    return (
        <div className={styles['tab-container']}>
            {tabs.map(tab => (
                <button
                    data-active={tab.value === currentTab?.value}
                    key={tab.value}
                    onClick={() => onTabChange?.(tab)}
                    type='button'
                    className={styles['tab-button']}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
