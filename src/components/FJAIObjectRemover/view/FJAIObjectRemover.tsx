import { IconAlertCircle, IconHistory, IconPhoto } from '@tabler/icons-react';

import styles from './FJAIObjectRemover.module.css';
import FJCoinIcon from '../../../assets/fj-coin.png';
import commonStyles from '../../../FJCommon.module.css';
import FJHeader from '../../header/FJHeader';
import FJImageUploader from '../../imageUploader/FJImageUploader';
import { useState, useMemo } from 'react';
import FJCanvasDesk from '../../canvas/FJCanvasDesk';
import FJCanvasTool from '../../canvas/FJCanvasTool';
import FJImageHistoryList from '../../imagesHistoryList/FJImageHistoryList';
import FJCanvasPlaceholder from '../../placeholder/FJCanvasPlaceholder';
import FJTab from '../../tab/FJTab';
import type { FJCanvasUtils } from '../../canvas/FJCanvasUtils';

enum FJAIObjectRemoverTab {
    Canvas = 'canvas',
    History = 'history',
}

const TABS = [
    { label: 'Creations', value: FJAIObjectRemoverTab.Canvas, icon: <IconPhoto size={18} /> },
    { label: 'History', value: FJAIObjectRemoverTab.History, icon: <IconHistory size={18} /> },
];

interface FJAIObjectRemoverProps {
    image?: HTMLImageElement | null;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    error?: Error | null;
    canvasSDK?: FJCanvasUtils | null;
    onScaleChange?: (scale: number) => void;
    onImageUpload?: (image: HTMLImageElement) => void;
    onDrawStart?: () => void;
    onEraseStart?: () => void;
    onStrokeWidthChange?: (width: number) => void;
    onRemoveObject?: () => void;
}

export default function FJAIObjectRemover({
    image,
    onCanvasReady,
    error,
    canvasSDK,
    onImageUpload,
    onScaleChange,
    onDrawStart,
    onEraseStart,
    onStrokeWidthChange,
    onRemoveObject,
}: FJAIObjectRemoverProps) {
    const [tab, setTab] = useState<FJAIObjectRemoverTab>(FJAIObjectRemoverTab.Canvas);
    const currentTab = useMemo(() => {
        return TABS.find(_tab => _tab.value === tab);
    }, [tab]);

    const isImageUploaded = useMemo(() => {
        return image !== null && image?.src !== '';
    }, [image]);

    const renderRemoveButton = useMemo(() => {
        return isImageUploaded ? (
            <button
                type='button'
                aria-label='remove object'
                onClick={onRemoveObject}
                className={`${commonStyles['fj-main-btn']} ${styles['remove-object-btn']}`}
            >
                Remove
                <span>
                    <img src={FJCoinIcon} width={16} height={16} alt='cost coin' />
                    -3
                </span>
            </button>
        ) : null;
    }, [isImageUploaded, onRemoveObject]);

    return (
        <div className={styles.container}>
            <FJHeader />
            {error ? (
                <div className={styles['error-container']}>
                    <div className={styles['error-icon']}>
                        <IconAlertCircle size={24} color='#ff3535bb' />
                    </div>
                    <div className={styles['error-message']}>Sorry, an error occurred: {error.message}</div>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles['left-content']}>
                        <FJImageUploader onImageUpload={onImageUpload} />
                        {isImageUploaded && (
                            <FJCanvasTool
                                canvasSDK={canvasSDK}
                                onDrawStart={onDrawStart}
                                onEraseStart={onEraseStart}
                                onStrokeWidthChange={onStrokeWidthChange}
                            />
                        )}
                        {renderRemoveButton}
                    </div>
                    <div className={styles['right-content']}>
                        <FJTab
                            currentTab={currentTab}
                            onTabChange={val => {
                                setTab(val.value as FJAIObjectRemoverTab);
                            }}
                            tabs={TABS}
                        />
                        {tab === FJAIObjectRemoverTab.Canvas &&
                            (!image ? (
                                <FJCanvasPlaceholder />
                            ) : (
                                <FJCanvasDesk
                                    image={image}
                                    onCanvasReady={onCanvasReady}
                                    canvasSDK={canvasSDK}
                                    onScaleChange={onScaleChange}
                                />
                            ))}
                        {tab === FJAIObjectRemoverTab.History && <FJImageHistoryList />}
                    </div>
                </div>
            )}
        </div>
    );
}
