import { useState } from 'react';
import styles from './canvasTool.module.css';
import { IconMinus } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react';

interface FJCanvasFloatToolBarProps {
    onScaleChange?: (scale: number) => void;
}

export default function FJCanvasFloatToolBar({ onScaleChange }: FJCanvasFloatToolBarProps) {
    const [scale, setScale] = useState(10);

    const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScale(Number(e.target.value));
        onScaleChange?.(Number(e.target.value));
    };

    return (
        <div className={styles['canvas-float-tool-bar']}>
            <div className={styles['canvas-float-tool-bar-item']}>
                <button className={styles['scale-tool-btn']}>
                    <IconMinus size={16} />
                </button>
                <input
                    type='range'
                    min='20'
                    max='150'
                    value={scale}
                    step={1}
                    onChange={handleScaleChange}
                    className={styles['width-input']}
                />
                <button className={styles['scale-tool-btn']}>
                    <IconPlus size={16} />
                </button>
            </div>
        </div>
    );
}
