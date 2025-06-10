import { useMemo, useState, useCallback, useLayoutEffect } from 'react';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';
import FJCanvasTool from '../components/canvas/FJCanvasTool';
import FJImageUploader from '../components/imageUploader/FJImageUploader';
import { FJCanvasUtils } from '../components/canvas/FJCanvasUtils';

import FJCoinIcon from '../assets/fj-coin.png';
import commonStyles from '../common.module.css';
import FJCanvasContainer from './FJCanvas.container';
import { removeObjectRequest } from '../requests/requests';

export default function FJAIObjectRemoveContainer() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [sdk, setSdk] = useState<FJCanvasUtils | null>(null);
    const [error] = useState<Error | null>(null);

    const isImageUploaded = useMemo(() => {
        return image !== null && image.src !== '';
    }, [image]);

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
            console.error(error);
            return;
        }

        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'mask.jpg';
        link.click();
    }, [sdk, canvas, image]);

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
            return;
        }
        return () => {
            _sdk?.destroy();
        };
    }, [canvas, image]);

    if (error) {
        return <div>Sorry, an error occurred: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <FJHeader />
            <div className={styles.content}>
                <div className={styles['left-content']}>
                    <FJImageUploader onImageUpload={handleUploadImage} />
                    {isImageUploaded && (
                        <FJCanvasTool
                            canvasSDK={sdk}
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
                            Remove
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
                        canvasSDK={sdk}
                        onScaleChange={handleScaleChange}
                    />
                </div>
            </div>
        </div>
    );
}
