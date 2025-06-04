import { useCallback, useState } from 'react';
import styles from './imageUploader.module.css';
import { IconUpload } from '@tabler/icons-react';

interface FJImageUploaderProps {
    onImageUpload?: (image: HTMLImageElement) => void;
}

export default function FJImageUploader(props: FJImageUploaderProps) {
    // const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const handleUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            props.onImageUpload?.(img);
            setImage(img);
        };
        img.onerror = e => {
            console.error(e);
        };
    }, []);
    return image ? (
        <div></div>
    ) : (
        <label className={styles['image-uploader']} title='Upload image'>
            <div className={styles['image-uploader-icon']}>
                <IconUpload size={20} />
            </div>
            upload image
            <input aria-label='Upload image' type='file' accept='image/*' onChange={handleUploadImage} />
        </label>
    );
}
