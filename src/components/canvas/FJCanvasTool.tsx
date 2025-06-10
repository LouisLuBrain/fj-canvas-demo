import { IconEraser, IconPencil } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import styles from './canvasTool.module.css';
import { FJCanvasUtils } from './FJCanvasUtils';

export type Tool = 'pencil' | 'eraser' | 'strokeWidth';

interface Props {
    onDrawStart?: () => void;
    onEraseStart?: () => void;
    onStrokeWidthChange?: (width: number) => void;
    canvasSDK?: FJCanvasUtils | null;
}

export default function FJCanvasTool({ onDrawStart, onEraseStart, onStrokeWidthChange, canvasSDK }: Props) {
    const [currentTool, setCurrentTool] = useState<Tool | null>(null);
    const [strokeWidth, setStrokeWidth] = useState<number>(1);

    const handleToolClick = useCallback((tool: Tool) => {
        setCurrentTool(tool);
    }, []);

    const handlePencilClick = useCallback(() => {
        handleToolClick('pencil');
        onDrawStart?.();
    }, [handleToolClick, onDrawStart]);

    const handleEraserClick = useCallback(() => {
        handleToolClick('eraser');
        onEraseStart?.();
    }, [handleToolClick, onEraseStart]);

    const handleStrokeWidthChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value);
            setStrokeWidth(value);
            onStrokeWidthChange?.(value);
        },
        [onStrokeWidthChange],
    );

    useEffect(() => {
        return canvasSDK?.onDestroy(() => {
            setCurrentTool(null);
            setStrokeWidth(1);
        });
    }, [canvasSDK]);

    return (
        <div className={styles['tool-bar']}>
            <div className={styles['tool-group']}>
                <div className={styles['tool-bar-title']}>Brush</div>
                <div data-active={currentTool === 'pencil'} className={styles['tool-bar-btn-border']}>
                    <button
                        data-active={currentTool === 'pencil'}
                        title='Draw'
                        onClick={handlePencilClick}
                        className={styles['tool-bar-btn']}
                    >
                        <IconPencil size={22} />
                        Draw
                    </button>
                </div>
                <div data-active={currentTool === 'eraser'} className={styles['tool-bar-btn-border']}>
                    <button
                        data-active={currentTool === 'eraser'}
                        title='Erase'
                        onClick={handleEraserClick}
                        className={styles['tool-bar-btn']}
                    >
                        <IconEraser size={22} />
                        Erase
                    </button>
                </div>
            </div>
            <div data-expanded={!!currentTool} className={styles['tool-group']}>
                <div className={styles['tool-bar-title']}>
                    Size
                    <span className={styles['width-value']}>{strokeWidth}</span>
                </div>
                <div className={styles['tool-group']}>
                    <input
                        type='range'
                        min='2'
                        max='100'
                        value={strokeWidth}
                        step={1}
                        onChange={handleStrokeWidthChange}
                        className={styles['width-input']}
                    />
                </div>
            </div>
        </div>
    );
}
