import { useMemo, useState } from 'react';
import FJImageHistoryList from '../components/imagesHistoryList/FJImageHistoryList';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';
import FJCanvasTool from '../components/canvas/FJCanvasTool';
import FJImageUploader from '../components/imageUploader/FJImageUploader';
import FJCanvasDesk from '../components/canvas/FJCanvasDesk';

import FJCoinIcon from '../assets/fj-coin.png';
import commonStyles from '../common.module.css';
import FJTab from '../components/tab/FJTab';
import { IconHistory, IconPhoto } from '@tabler/icons-react';

const TABS = [
    { label: 'Creations', value: 'canvas', icon: <IconPhoto size={18} /> },
    { label: 'History', value: 'history', icon: <IconHistory size={18} /> },
];

export default function FJAIObjectRemoveContainer() {
    const [tab, setTab] = useState<'canvas' | 'history'>('canvas');
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const currentTab = useMemo(() => {
        return TABS.find(_tab => _tab.value === tab);
    }, [tab]);

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
                    <FJTab
                        currentTab={currentTab}
                        onTabChange={val => {
                            setTab(val.value as 'canvas' | 'history');
                        }}
                        tabs={TABS}
                    />
                    {tab === 'canvas' && <FJCanvasDesk />}
                    {tab === 'history' && <FJImageHistoryList />}
                </div>
            </div>
        </div>
    );
}
