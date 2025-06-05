'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { FJCanvasUtils } from './FJCanvasUtils';
import FJCanvasFloatToolBar from './FJCanvasFloatToolBar';

interface FJCanvasDeskProps {
    width?: number;
    height?: number;
    ref?: React.RefObject<HTMLCanvasElement>;
}

const FJCanvasDesk: React.FC<FJCanvasDeskProps> = (props: FJCanvasDeskProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [, setSdk] = useState<FJCanvasUtils | null>(null);
    const [showPlaceholder, setShowPlaceholder] = useState<boolean>(false);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let sdk: FJCanvasUtils | null = null;

        try {
            sdk = new FJCanvasUtils(canvas, props.width || 800, props.height || 600);
            setSdk(sdk);
        } catch (error) {
            console.error(error);
            setShowPlaceholder(true);
            return;
        }

        return () => {
            sdk?.destroy();
        };
    }, [props]);

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
        <div style={{ position: 'relative' }} className='flex flex-col shadow-sm px-4 pt-2 pb-4 rounded-md box-content'>
            <FJCanvasFloatToolBar />
            <div className='overflow-hidden border border-gray-300 rounded-md'>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default FJCanvasDesk;
