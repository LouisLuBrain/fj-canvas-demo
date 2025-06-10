import { useEffect, useMemo, useState } from 'react';
import styles from './rangeInput.module.css';

interface FJRangeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number;
}

export default function FJRangeInput(props: FJRangeInputProps) {
    const [localValue, setLocalValue] = useState(props.value);

    useEffect(() => {
        setLocalValue(props.value);
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setLocalValue(value);
        props.onChange?.(e);
    };

    const progress = useMemo(() => {
        const max = Number(props.max) || 100;
        const min = Number(props.min) || 0;
        return `${((localValue - min) / (max - min)) * 100}%`;
    }, [localValue, props.max, props.min]);

    return (
        <div className={styles['range-input-container']}>
            <label className={styles['range-input-thumb']}>
                <input
                    {...props}
                    type='range'
                    value={localValue}
                    onChange={handleChange}
                    className={styles['range-input']}
                    style={{ '--progress': `${progress}` } as React.CSSProperties}
                />
            </label>
        </div>
    );
}
