import { useLayoutEffect, useState } from 'react';
import styles from './tab.module.css';

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
    const [activeTabWidth, setActiveTabWidth] = useState(0);
    const [activeTabOffsetLeft, setActiveTabOffsetLeft] = useState(0);

    useLayoutEffect(() => {
        console.log('LOG ===> currentTab: ', currentTab);
        const btn = document.querySelector(`.${styles['tab-button']}[data-active='true']`);
        console.log('LOG ===> btn: ', btn);
        setActiveTabWidth(btn?.clientWidth || 0);
        setActiveTabOffsetLeft(btn?.scrollLeft || 0);
    }, [currentTab]);

    return (
        <div
            className={styles['tab-container']}
            style={
                {
                    '--active-tab-width': activeTabWidth + 'px',
                    '--active-tab-offset-left': activeTabOffsetLeft + 'px',
                } as React.CSSProperties
            }
        >
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
