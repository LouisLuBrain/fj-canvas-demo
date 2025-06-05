import { useState, useMemo } from 'react';
import FJCanvasDesk from '../components/canvas/FJCanvasDesk';
import FJImageHistoryList from '../components/imagesHistoryList/FJImageHistoryList';
import FJTab from '../components/tab/FJTab';
import { IconHistory, IconPhoto } from '@tabler/icons-react';
import styles from './canvas.container.module.css';

const TABS = [
    { label: 'Creations', value: 'canvas', icon: <IconPhoto size={18} /> },
    { label: 'History', value: 'history', icon: <IconHistory size={18} /> },
];

interface FJCanvasContainerProps {
    image?: HTMLImageElement;
}

export default function FJCanvasContainer({ image }: FJCanvasContainerProps) {
    const [tab, setTab] = useState<'canvas' | 'history'>('canvas');
    const currentTab = useMemo(() => {
        return TABS.find(_tab => _tab.value === tab);
    }, [tab]);

    const renderPlaceholder = () => (
        <div className={styles['canvas-placeholder']}>
            <div className={styles['canvas-placeholder-content']}>
                <h1>Quickly remove unwanted objects using AI</h1>
                <p>Remove objects efficiently, create images professionally</p>
                <video
                    className={styles['canvas-placeholder-video']}
                    src='https://www.flexclip.com/app/ai-tools/img/objectEraser/video.mp4?v=1.0.22'
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>
        </div>
    );

    return (
        <>
            <FJTab
                currentTab={currentTab}
                onTabChange={val => {
                    setTab(val.value as 'canvas' | 'history');
                }}
                tabs={TABS}
            />
            {tab === 'canvas' && (!image ? renderPlaceholder() : <FJCanvasDesk image={image} />)}
            {tab === 'history' && <FJImageHistoryList />}
        </>
    );
}
