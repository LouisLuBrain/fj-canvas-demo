import { useState, useCallback, useLayoutEffect } from 'react';
import { FJCanvasUtils } from '../../canvas/FJCanvasUtils';

import { useToast } from '../../toast/ToastProvider';
import { removeObjectRequest } from '../../../requests/requests';
import FJAIObjectRemover from '../view/FJAIObjectRemover';

export default function FJAIObjectRemoveContainer() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [sdk, setSdk] = useState<FJCanvasUtils | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { showToast } = useToast();

    const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
        setCanvas(canvas);
    }, []);

    const handleDrawStart = useCallback(() => {
        sdk?.stopEraser();
        sdk?.startDrawLine();
    }, [sdk]);

    const handleEraseStart = useCallback(() => {
        sdk?.stopDrawLine();
        sdk?.startEraser();
    }, [sdk]);

    const handleStrokeWidthChange = useCallback(
        (width: number) => {
            sdk?.setStrokeWidth(width);
        },
        [sdk],
    );

    const handleRemoveObject = useCallback(async () => {
        if (!sdk || !canvas || !image) return;
        const imageData = sdk.exportMaskData();
        if (!imageData) return;
        try {
            await removeObjectRequest({
                image: image.src,
                mask: imageData,
            });
        } catch (error) {
            showToast({
                message: 'Failed to remove object',
                type: 'error',
            });
            console.error(error);
            return;
        }

        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'mask.jpg';
        link.click();
    }, [sdk, canvas, image, showToast]);

    const handleUploadImage = useCallback((image: HTMLImageElement) => {
        setImage(image);
    }, []);

    const handleScaleChange = useCallback(
        (scale: number) => {
            if (!sdk) return;
            sdk.setScale(scale / 100);
        },
        [sdk],
    );

    useLayoutEffect(() => {
        if (!canvas || !image) return;

        let _sdk: FJCanvasUtils | null = null;
        try {
            _sdk = new FJCanvasUtils(canvas, canvas.clientWidth, canvas.clientHeight);
            setSdk(_sdk);

            _sdk.clear();
            _sdk.drawImage(image);
        } catch (error) {
            console.error(error);
            setError(error as Error);
            return;
        }
        return () => {
            _sdk?.destroy();
        };
    }, [canvas, image]);

    return (
        <FJAIObjectRemover
            image={image}
            onCanvasReady={handleCanvasReady}
            error={error}
            canvasSDK={sdk}
            onImageUpload={handleUploadImage}
            onScaleChange={handleScaleChange}
            onDrawStart={handleDrawStart}
            onEraseStart={handleEraseStart}
            onStrokeWidthChange={handleStrokeWidthChange}
            onRemoveObject={handleRemoveObject}
        />
    );
}
