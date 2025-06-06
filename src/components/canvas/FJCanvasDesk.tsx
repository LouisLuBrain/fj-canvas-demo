'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FJCanvasUtils } from './FJCanvasUtils';
import FJCanvasFloatToolBar from './FJCanvasFloatToolBar';
import styles from './canvasDesk.module.css';

interface FJCanvasDeskProps {
    image?: HTMLImageElement;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    onSDKReady?: (sdk: FJCanvasUtils) => void;
    onError?: (error: Error) => void;
}

const FJCanvasDesk: React.FC<FJCanvasDeskProps> = ({
    image,
    onCanvasReady,
    onSDKReady,
    onError,
}: FJCanvasDeskProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sdkRef = useRef<FJCanvasUtils | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [shouldShowBrushPointer, setShouldShowBrushPointer] = useState(false);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        onCanvasReady?.(canvas);

        let sdk: FJCanvasUtils | null = null;

        try {
            sdk = new FJCanvasUtils(canvas, canvas.clientWidth, canvas.clientHeight, sdkRef.current?.getConfig());
            sdkRef.current = sdk;
            onSDKReady?.(sdk);

            sdk.clear();
            const pattern = sdk.drawImage(image);
            if (pattern) sdk.setEraserColor(pattern);
        } catch (error) {
            console.error(error);
            onError?.(error as Error);
            return;
        }

        return () => {
            sdk?.destroy();
        };
    }, [image, onCanvasReady, onSDKReady, onError]);

    const handleScaleChange = useCallback((scale: number) => {
        if (!sdkRef.current) return;
        sdkRef.current.setScale(scale / 100);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        if (!canvasContainerRef.current) return;
        const canvasContainer = canvasContainerRef.current;
        // const canvas = canvasRef.current;

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

    const brushPointerStyle = useMemo(() => {
        const scale = sdkRef.current?.getConfig()?.scale ?? 1;
        const strokeWidth = sdkRef.current?.getConfig()?.strokeWidth ?? 2;
        const dpr = sdkRef.current?.getConfig()?.dpr ?? 1;
        const radius = strokeWidth / 2;
        const isInEraserMode = sdkRef.current?.getConfig()?.isInEraserMode ?? false;
        return {
            transform: `translate(${position.x - (radius / dpr) * scale}px, ${position.y - (radius / dpr) * scale}px)`,
            width: radius * scale,
            height: radius * scale,
            border: isInEraserMode ? '1px solid #00f' : '1px solid #fff',
            backgroundColor: isInEraserMode ? '#fff' : '#00f',
        };
    }, [position.x, position.y]);

    return (
        <div className={styles['canvas-desk']}>
            <FJCanvasFloatToolBar onScaleChange={handleScaleChange} />
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
