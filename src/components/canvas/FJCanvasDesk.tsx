'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { FJCanvasUtils } from './FJCanvasUtils';
import FJCanvasFloatToolBar from './FJCanvasFloatToolBar';
import styles from './canvasDesk.module.css';

interface FJCanvasDeskProps {
    width?: number;
    height?: number;
    ref?: React.RefObject<HTMLCanvasElement>;
    image?: HTMLImageElement;
}

const FJCanvasDesk: React.FC<FJCanvasDeskProps> = ({ width, height, image }: FJCanvasDeskProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [, setSdk] = useState<FJCanvasUtils | null>(null);
    const [showPlaceholder, setShowPlaceholder] = useState<boolean>(false);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let sdk: FJCanvasUtils | null = null;

        try {
            sdk = new FJCanvasUtils(canvas, width || 800, height || 600);
            setSdk(sdk);

            if (image) {
                sdk.clear();
                const pattern = sdk.drawImage(image, 0, 0);
                if (pattern) sdk.setEraserColor(pattern);
            }
        } catch (error) {
            console.error(error);
            setShowPlaceholder(true);
            return;
        }

        return () => {
            sdk?.destroy();
        };
    }, [width, height, image]);

    // const handleToolChange = useCallback(
    //     (tool: Tool, value?: number) => {
    //         if (!sdk) return;

    //         const canvas = canvasRef.current;
    //         if (!canvas) return;

    //         if (tool === 'pencil') {
    //             sdk.startDrawLine();
    //         } else {
    //             sdk.stopDrawLine();
    //         }

    //         if (tool === 'clear') {
    //             sdk.clear();
    //         }

    //         if (tool === 'eraser') {
    //             sdk.startEraser();
    //         } else {
    //             sdk.stopEraser();
    //         }

    //         if (tool === 'scale') {
    //             sdk.setScale(value ?? 1);
    //         }
    //     },
    //     [sdk],
    // );

    // const handleUploadImage = useCallback(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
    //         const file = e.target.files?.[0];
    //         if (!file) return;

    //         const url = URL.createObjectURL(file);
    //         const img = new Image();
    //         img.src = url;
    //         img.onload = () => {
    //             sdk?.clear();
    //             const pattern = sdk?.drawImage(img, 0, 0);
    //             if (pattern) sdk?.setEraserColor(pattern);
    //         };
    //     },
    //     [sdk],
    // );

    return showPlaceholder ? (
        <div>Sorry, your browser doesn't support canvas feature.</div>
    ) : (
        <div className={styles['canvas-desk']}>
            <FJCanvasFloatToolBar />
            <div className={styles['canvas-container']}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default FJCanvasDesk;
