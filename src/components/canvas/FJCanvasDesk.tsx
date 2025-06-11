'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FJCanvasUtils } from './FJCanvasUtils';
import FJCanvasFloatToolBar from './FJCanvasFloatToolBar';
import styles from './FJCanvasDesk.module.css';

interface FJCanvasDeskProps {
    image?: HTMLImageElement;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    canvasSDK?: FJCanvasUtils | null;
    onScaleChange?: (scale: number) => void;
}

const FJCanvasDesk: React.FC<FJCanvasDeskProps> = ({
    image,
    onCanvasReady,
    canvasSDK,
    onScaleChange,
}: FJCanvasDeskProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(100);

    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [shouldShowBrushPointer, setShouldShowBrushPointer] = useState(false);

    // 初始化画布
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        onCanvasReady?.(canvas);
    }, [image, onCanvasReady]);

    // 缩放画布
    const handleScaleChange = useCallback(
        (scale: number) => {
            setScale(scale);
            onScaleChange?.(scale);
        },
        [onScaleChange],
    );

    // 画笔指针
    useEffect(() => {
        if (!canvasRef.current) return;
        if (!canvasContainerRef.current) return;
        const canvasContainer = canvasContainerRef.current;

        canvasContainer.addEventListener('mouseenter', drawBrushPointer);

        canvasContainer.addEventListener('mouseleave', clearBrushPointer);

        canvasContainer.addEventListener('mousemove', moveBrushPointer);

        return () => {
            canvasContainer.removeEventListener('mouseenter', drawBrushPointer);
            canvasContainer.removeEventListener('mouseleave', clearBrushPointer);
            canvasContainer.removeEventListener('mousemove', moveBrushPointer);
        };
    }, []);

    const drawBrushPointer = () => {
        setShouldShowBrushPointer(true);
    };

    const clearBrushPointer = () => {
        setShouldShowBrushPointer(false);
    };

    const moveBrushPointer = (ev: MouseEvent) => {
        setPosition({
            x: ev.offsetX,
            y: ev.offsetY,
        });
    };

    // 画笔指针样式
    const brushPointerStyle = useMemo(() => {
        const scale = canvasSDK?.getConfig()?.scale ?? 1;

        const strokeWidth = canvasSDK?.getConfig()?.strokeWidth ?? 2;
        const dpr = canvasSDK?.getConfig()?.dpr ?? 1;
        const diameter = (strokeWidth / dpr) * scale;
        const isInEraserMode = canvasSDK?.getConfig()?.isInEraserMode ?? false;
        return {
            transform: `translate(${position.x - diameter / 2}px, ${position.y - diameter / 2}px)`,
            width: diameter,
            height: diameter,
            border: isInEraserMode ? '1px solid #00f' : '1px solid #fff',
            backgroundColor: isInEraserMode ? '#fff' : '#00f',
        };
    }, [canvasSDK, position.x, position.y]);

    useEffect(() => {
        return canvasSDK?.onDestroy(() => {
            setScale(100);
            canvasSDK?.setScale(1);
        });
    }, [canvasSDK]);

    return (
        <div className={styles['canvas-desk']}>
            <FJCanvasFloatToolBar scale={scale} onScaleChange={handleScaleChange} />
            <div ref={canvasContainerRef} id='canvas-container' className={styles['canvas-container']}>
                <canvas ref={canvasRef} />
                <div
                    id='brush-pointer'
                    className={styles['brush-pointer']}
                    style={{
                        ...brushPointerStyle,
                        display: shouldShowBrushPointer ? 'block' : 'none',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default FJCanvasDesk;
