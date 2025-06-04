import { IconEraser, IconPencil, IconScale, IconTrash } from '@tabler/icons-react';
import { useCallback, useState } from 'react';

export type Tool = 'pencil' | 'eraser' | 'color' | 'scale' | 'clear';

interface Props {
    width?: number;
    onToolChange?: (tool: Tool, value?: number) => void;
}

export default function FJCanvasTool({ width, onToolChange }: Props) {
    const [currentTool, setCurrentTool] = useState<Tool>();
    const [scale, setScale] = useState<number>(50);

    const handleToolClick = useCallback(
        (tool: Tool, value?: number) => {
            setCurrentTool(tool);
            onToolChange?.(tool, value);
        },

        [onToolChange, setCurrentTool],
    );

    const handlePencilClick = useCallback(() => {
        handleToolClick('pencil');
    }, [handleToolClick]);

    const handleEraserClick = useCallback(() => {
        handleToolClick('eraser');
    }, [handleToolClick]);

    const handleColorClick = useCallback(() => {
        // change color code here
    }, []);

    const handleScaleClick = useCallback(() => {
        handleToolClick('scale');
    }, [handleToolClick]);

    const handleScaleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setScale(Number(e.target.value));
            handleToolClick('scale', Number(e.target.value) / 50);
        },
        [handleToolClick],
    );

    const handleClearClick = useCallback(() => {
        onToolChange?.('clear');
    }, [onToolChange]);

    return (
        <div className='flex items-center justify-start gap-x-4 p-2' style={{ width: width }}>
            <div className='flex flex-row items-center justify-center gap-2'>
                <button
                    data-active={currentTool === 'pencil'}
                    title='pencil'
                    onClick={handlePencilClick}
                    className='btn'
                >
                    <IconPencil size={22} />
                </button>

                {currentTool === 'pencil' && (
                    <div className='flex flex-row items-center justify-center'>
                        <button
                            title='color'
                            onClick={handleColorClick}
                            className='w-7.5 h-7.5 btn justify-center flex items-center hover:bg-blue-50'
                        >
                            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: '#000' }}></div>
                        </button>
                    </div>
                )}
            </div>
            <div className='flex flex-row items-center justify-center'>
                <button
                    data-active={currentTool === 'eraser'}
                    title='eraser'
                    onClick={handleEraserClick}
                    className='btn'
                >
                    <IconEraser size={22} />
                </button>
            </div>

            <div className='flex flex-row items-center justify-center gap-2'>
                <button data-active={currentTool === 'scale'} title='scale' onClick={handleScaleClick} className='btn'>
                    <IconScale size={22} />
                </button>
                {currentTool === 'scale' && (
                    <div>
                        <input type='range' min='0' max='100' value={scale} step={10} onChange={handleScaleChange} />
                        <span>{(scale / 50) * 100}%</span>
                    </div>
                )}
            </div>

            <div className='flex flex-row items-center justify-center'>
                <button title='clear' onClick={handleClearClick} className='btn'>
                    <IconTrash size={22} />
                </button>
            </div>
        </div>
    );
}
