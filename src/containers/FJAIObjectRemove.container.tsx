import { useMemo, useState } from 'react';
import FJImageHistoryList from '../components/imagesHistoryList/FJImageHistoryList';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';
import FJCanvasTool from '../components/canvas/FJCanvasTool';
import FJImageUploader from '../components/imageUploader/FJImageUploader';
import FJCanvasDesk from '../components/canvas/FJCanvasDesk';

import FJCoinIcon from '../assets/fj-coin.png';
import commonStyles from '../common.module.css';

export default function FJAIObjectRemoveContainer() {
    const [tab, setTab] = useState<'canvas' | 'history'>('canvas');
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const isImageUploaded = useMemo(() => {
        return true;
        // return image !== null && image.src !== '';
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
                    <div>
                        <button onClick={() => setTab('canvas')}>Canvas</button>
                        <button onClick={() => setTab('history')}>History</button>
                    </div>
                    {tab === 'canvas' && <FJCanvasDesk />}
                    {tab === 'history' && <FJImageHistoryList />}
                </div>
            </div>
        </div>
    );
}
