import { IconChevronDown, IconPlus, IconSparkles } from '@tabler/icons-react';
import styles from './FJHeader.module.css';
import fjLogo from '../../assets/fj-logo.svg';
import fjUserProfile from '../../assets/fj-user-profile.svg';
import fjCoin from '../../assets/fj-coin.png';

export default function FJHeader() {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <img width={91} height={29} src={fjLogo} alt='FJ Logo' />
            </div>
            <div className={styles.more}>
                <IconSparkles color='#c907ff' fill='#c907ff' />
                More AI Tools
                <IconChevronDown size={14} />
            </div>
            <div className={styles.placeholder}></div>
            <div className={styles.credits}>
                <img width={24} height={24} src={fjCoin} alt='Coin' />
                <span>9580.3</span>
                <div className={styles.plus}>
                    <IconPlus size={14} stroke={4} />
                </div>
            </div>
            <div className={styles['user-profile']}>
                <img width={40} height={40} src={fjUserProfile} alt='User Profile' />
            </div>
        </div>
    );
}
