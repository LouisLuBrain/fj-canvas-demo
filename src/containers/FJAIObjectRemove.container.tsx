import { useMemo, useState } from 'react';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';
import FJCanvasTool from '../components/canvas/FJCanvasTool';
import FJImageUploader from '../components/imageUploader/FJImageUploader';

import FJCoinIcon from '../assets/fj-coin.png';
import commonStyles from '../common.module.css';
import FJCanvasContainer from './FJCanvas.container';

export default function FJAIObjectRemoveContainer() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const isImageUploaded = useMemo(() => {
        return image !== null && image.src !== '';
    }, [image]);

    const handleRemoveObject = () => {
        // TODO: call remove object api here
    };

    return (
        <div className={styles.container}>
            <FJHeader />
            <div className={styles.content}>
                <div className={styles['left-content']}>
                    <FJImageUploader onImageUpload={setImage} />
                    {isImageUploaded && <FJCanvasTool />}
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
                    <FJCanvasContainer />
                </div>
            </div>
        </div>
    );
}
