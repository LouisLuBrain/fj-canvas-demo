import styles from './imageHistoryList.module.css';

import image1 from '../../assets/alexander-mass-ohVkrmTwirg-unsplash.jpg';
import image2 from '../../assets/andrey-k-FUKidTAPUdk-unsplash.jpg';
import image3 from '../../assets/luca-ercolani-pPLKOwxVmfE-unsplash.jpg';
import image4 from '../../assets/anna-spoljar-dfaCZjYYNTE-unsplash.jpg';
import image5 from '../../assets/daniel-akselrod-GRgfv49Nf-M-unsplash.jpg';

const IMAGE_HISTORY_LIST = [
    { imageURL: image1, id: crypto.randomUUID() },
    { imageURL: image2, id: crypto.randomUUID() },
    { imageURL: image3, id: crypto.randomUUID() },
    { imageURL: image4, id: crypto.randomUUID() },
    { imageURL: image5, id: crypto.randomUUID() },
];

export default function FJImageHistoryList() {
    return (
        <div className={styles['images-history-list-container']}>
            <div className={styles['images-history-list']}>
                {IMAGE_HISTORY_LIST.map(item => (
                    <div className={styles['images-history-list-item']} key={item.id}>
                        <img
                            className={styles['images-history-list-item-image']}
                            src={item.imageURL}
                            alt='history image'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
