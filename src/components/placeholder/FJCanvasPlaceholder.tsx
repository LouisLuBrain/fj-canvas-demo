import styles from './canvasPlaceholder.module.css';

interface FJCanvasPlaceholderProps {
    title?: string;
    description?: string;
    videoUrl?: string;
}

export default function FJCanvasPlaceholder({
    title = 'Quickly remove objects from the picture',
    description = 'Easy and efficient',
    videoUrl = 'https://www.flexclip.com/app/ai-tools/img/objectEraser/video.mp4?v=1.0.22',
}: FJCanvasPlaceholderProps) {
    return (
        <div className={styles['canvas-placeholder']}>
            <div className={styles['canvas-placeholder-content']}>
                <h1>{title}</h1>
                <p>{description}</p>
                <video className={styles['canvas-placeholder-video']} src={videoUrl} autoPlay loop muted playsInline />
            </div>
        </div>
    );
}
