import styles from './FJApp.module.css';
import { FJToastProvider } from './components/toast/ToastProvider';
import FJAIObjectRemovePage from './pages/FJAIObjectRemovePage';

function App() {
    return (
        <FJToastProvider>
            <div className={styles.page}>
                <FJAIObjectRemovePage />
            </div>
        </FJToastProvider>
    );
}

export default App;
