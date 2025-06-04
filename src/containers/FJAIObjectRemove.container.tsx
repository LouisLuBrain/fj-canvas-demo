import { useState } from 'react';
import FJImageHistoryList from '../components/imagesHistoryList/FJImageHistoryList';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';
import FJCanvasTool from '../components/canvas/FJCanvasTool';
import FJImageUploader from '../components/imageUploader/FJImageUploader';
import FJCanvasDesk from '../components/canvas/FJCanvasDesk';

export default function FJAIObjectRemoveContainer() {
    const [tab, setTab] = useState<'canvas' | 'history'>('canvas');

    return (
        <div className={styles.container}>
            <FJHeader />
            <div className={styles.content}>
                <div className={styles['left-content']}>
                    <FJImageUploader />
                    <FJCanvasTool />
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
