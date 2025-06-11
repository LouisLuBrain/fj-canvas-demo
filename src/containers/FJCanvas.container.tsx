import { useState, useMemo } from 'react';
import FJCanvasDesk from '../components/canvas/FJCanvasDesk';
import FJImageHistoryList from '../components/imagesHistoryList/FJImageHistoryList';
import FJTab from '../components/tab/FJTab';
import { IconHistory, IconPhoto } from '@tabler/icons-react';
import FJCanvasPlaceholder from '../components/placeholder/FJCanvasPlaceholder';
import { FJCanvasUtils } from '../components/canvas/FJCanvasUtils';

const TABS = [
    { label: 'Creations', value: 'canvas', icon: <IconPhoto size={18} /> },
    { label: 'History', value: 'history', icon: <IconHistory size={18} /> },
];

interface FJCanvasContainerProps {
    image?: HTMLImageElement | null;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    canvasSDK?: FJCanvasUtils | null;
    onScaleChange?: (scale: number) => void;
}

/**
 * @deprecated ref to [FJAIObjectRemoverContainer](../components/FJAIObjectRemover/container/FJAIObjectRemover.container.tsx)
 */
export default function FJCanvasContainer({ image, onCanvasReady, canvasSDK, onScaleChange }: FJCanvasContainerProps) {
    const [tab, setTab] = useState<'canvas' | 'history'>('canvas');
    const currentTab = useMemo(() => {
        return TABS.find(_tab => _tab.value === tab);
    }, [tab]);

    return (
        <>
            <FJTab
                currentTab={currentTab}
                onTabChange={val => {
                    setTab(val.value as 'canvas' | 'history');
                }}
                tabs={TABS}
            />
            {tab === 'canvas' &&
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
            {tab === 'history' && <FJImageHistoryList />}
        </>
    );
}
