import { useMemo, useState } from 'react';
import styles from './imageUploader.module.css';
import fjUploadIcon from '../../assets/fj-upload-icon.svg';
import { IconUpload } from '@tabler/icons-react';
import commonStyles from '../../common.module.css';

const ACCEPT_IMAGE_FORMAT = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/jfif',
    'image/tiff',
    'image/bmp',
];

interface FJImageUploaderProps {
    onImageUpload?: (image: HTMLImageElement) => void;
}

export default function FJImageUploader(props: FJImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const isImageUploaded = useMemo(() => {
        return image !== null && image.src !== '';
    }, [image]);

    const handleUploadImage = (file: File) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            props.onImageUpload?.(img);
            setImage(img);
        };
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleUploadImage(file);
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        files.map(file => {
            if (ACCEPT_IMAGE_FORMAT.includes(file.type)) {
                handleUploadImage(file);
            } else {
                console.error('Unsupported format. Please upload images in jpg, png, etc.');
            }
        });
    };

    return (
        <label
            className={`${styles['image-uploader']} ${isDragging ? styles['dragging'] : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-is-uploaded={isImageUploaded}
        >
            {isImageUploaded ? (
                <>
                    <div className={styles['image-uploader-uploaded-icon']}>
                        <IconUpload size={18} />
                    </div>
                    <span className={styles['image-uploader-uploaded-text']}>Upload Up to 10 Images</span>
                </>
            ) : (
                <>
                    <div className={styles['image-uploader-icon']}>
                        <img src={fjUploadIcon} alt='upload' />
                    </div>
                    <span className={styles['image-uploader-text']}>
                        {isImageUploaded ? 'Upload Up to 10 Images' : 'Click or drag to upload'}
                    </span>
                    <div className={`${commonStyles['fj-main-btn']} ${styles['image-uploader-btn']}`}>Upload Image</div>
                </>
            )}

            <input
                type='file'
                accept={ACCEPT_IMAGE_FORMAT.join(',')}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
                max={10}
            />
        </label>
    );
}
