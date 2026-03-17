import styles from './styles.module.css';

const Preloader = () => {
  return (
    <div className={styles.preloaderContainer}>
      <div className={styles.preloader}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    </div>
  );
};

export default Preloader;