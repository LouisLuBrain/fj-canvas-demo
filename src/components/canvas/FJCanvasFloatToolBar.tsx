import { IconMinus, IconPlus } from '@tabler/icons-react';
import styles from './canvasTool.module.css';
import { useCallback, useState } from 'react';

const MIN_SCALE = 20;
const MAX_SCALE = 150;
const BTN_STEP = 10;
const RANGE_STEP = 1;

interface FJCanvasFloatToolBarProps {
    onScaleChange?: (scale: number) => void;
}

export default function FJCanvasFloatToolBar({ onScaleChange }: FJCanvasFloatToolBarProps) {
    const [scale, setScale] = useState(100);

    const handleScaleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setScale(Number(e.target.value));
            onScaleChange?.(Number(e.target.value));
        },
        [onScaleChange],
    );

    const handleScaleBtnClick = useCallback(
        (type: 'increase' | 'decrease') => {
            let _scale = scale;
            if (type === 'increase') {
                _scale = Math.min(_scale + BTN_STEP, MAX_SCALE);
            } else {
                _scale = Math.max(_scale - BTN_STEP, MIN_SCALE);
            }
            setScale(_scale);
            onScaleChange?.(_scale);
        },
        [scale, onScaleChange],
    );

    return (
        <div className={styles['canvas-float-tool-bar']}>
            <div className={styles['canvas-float-tool-bar-item']}>
                <button
                    className={styles['scale-tool-btn']}
                    onClick={() => handleScaleBtnClick('decrease')}
                    title='zoom out'
                >
                    <IconMinus size={16} />
                </button>
                <input
                    type='range'
                    min={MIN_SCALE}
                    max={MAX_SCALE}
                    defaultValue={MIN_SCALE}
                    step={RANGE_STEP}
                    value={scale}
                    onChange={handleScaleChange}
                    className={styles['width-input']}
                />
                <button
                    className={styles['scale-tool-btn']}
                    onClick={() => handleScaleBtnClick('increase')}
                    title='zoom in'
                >
                    <IconPlus size={16} />
                </button>
            </div>
        </div>
    );
}
