import styles from './CustomPopUp.module.css';

export default function CustomPopUp({ message, type = 'info', onClose, onConfirm }) {
  return (
    <div className={styles.alertOverlay}>
      <div className={`${styles.alertBox} ${styles[type]}`}>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          {type === 'warning' ? (
            <>
              <button className={`${styles.alertButton} ${styles.cancelButton}`} onClick={onClose}>
                Cancel
              </button>
              <button className={`${styles.alertButton} ${styles.confirmButton}`} onClick={onConfirm}>
                Confirm
              </button>
            </>
          ) : (
            <button className={`${styles.alertButton} ${styles.successButton}`} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}