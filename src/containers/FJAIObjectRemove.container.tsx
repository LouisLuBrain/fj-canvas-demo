import { useMemo, useState, useCallback } from 'react';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';
import FJCanvasTool from '../components/canvas/FJCanvasTool';
import FJImageUploader from '../components/imageUploader/FJImageUploader';
import { FJCanvasUtils } from '../components/canvas/FJCanvasUtils';

import FJCoinIcon from '../assets/fj-coin.png';
import commonStyles from '../common.module.css';
import FJCanvasContainer from './FJCanvas.container';

export default function FJAIObjectRemoveContainer() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [sdk, setSdk] = useState<FJCanvasUtils | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const isImageUploaded = useMemo(() => {
        return image !== null && image.src !== '';
    }, [image]);

    const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
        setCanvas(canvas);
    }, []);

    const handleSDKReady = useCallback((sdk: FJCanvasUtils) => {
        setSdk(sdk);
    }, []);

    const handleCanvasError = useCallback((error: Error) => {
        setError(error);
        // 可以在这里添加错误处理逻辑，比如显示错误提示等
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

    const handleRemoveObject = useCallback(() => {
        if (!sdk || !canvas) return;
        const imageData = sdk.exportMaskData();
        if (!imageData) return;
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'mask.jpg';
        link.click();
    }, [sdk, canvas]);

    if (error) {
        return <div>Sorry, an error occurred: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <FJHeader />
            <div className={styles.content}>
                <div className={styles['left-content']}>
                    <FJImageUploader onImageUpload={setImage} />
                    {isImageUploaded && (
                        <FJCanvasTool
                            onDrawStart={handleDrawStart}
                            onEraseStart={handleEraseStart}
                            onStrokeWidthChange={handleStrokeWidthChange}
                        />
                    )}
                    {isImageUploaded && (
                        <button
                            type='button'
                            aria-label='remove object'
                            onClick={handleRemoveObject}
                            className={`${commonStyles['fj-main-btn']} ${styles['remove-object-btn']}`}
                        >
                            Generate
                            <span>
                                <img src={FJCoinIcon} width={16} height={16} alt='cost coin' />
                                -3
                            </span>
                        </button>
                    )}
                </div>
                <div className={styles['right-content']}>
                    <FJCanvasContainer
                        image={image}
                        onCanvasReady={handleCanvasReady}
                        onSDKReady={handleSDKReady}
                        onError={handleCanvasError}
                    />
                </div>
            </div>
        </div>
    );
}
