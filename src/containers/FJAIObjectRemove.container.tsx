import { useState } from 'react';
import FJImageHistoryList from '../components/imagesHistoryList/FJImageHistoryList';
import FJCanvasContainer from './FJCanvas.container';
import FJHeader from '../components/header/FJHeader';
import styles from './container.module.css';

export default function FJAIObjectRemoveContainer() {
    const [tab, setTab] = useState<'canvas' | 'history'>('canvas');
    // TODO: get data here
    return (
        <div className={styles.container}>
            <FJHeader />
            <div>
                <button onClick={() => setTab('canvas')}>Canvas</button>
                <button onClick={() => setTab('history')}>History</button>
            </div>
            {tab === 'canvas' && <FJCanvasContainer />}
            {tab === 'history' && <FJImageHistoryList />}
        </div>
    );
}
