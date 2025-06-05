'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
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

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        onCanvasReady?.(canvas);

        let sdk: FJCanvasUtils | null = null;

        try {
            sdk = new FJCanvasUtils(canvas, canvas.width, canvas.height);
            sdkRef.current = sdk;
            onSDKReady?.(sdk);

            sdk.clear();
            const pattern = sdk.drawImage(image, 0, 0);
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

    return (
        <div className={styles['canvas-desk']}>
            <FJCanvasFloatToolBar onScaleChange={handleScaleChange} />
            <div className={styles['canvas-container']}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default FJCanvasDesk;
