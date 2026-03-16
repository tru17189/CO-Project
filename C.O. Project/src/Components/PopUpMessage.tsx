import styles from "./styles/PopUp.module.css";

interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function PopupMessage({ title, message, onClose, onConfirm }: PopupProps) {
    return (
        <div className={styles.popupWrapper}>
            <div className={styles.popupBackground}>
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>
                    Regresar
                </button>
                <button onClick={onConfirm}>
                    Confirmar
                </button>
            </div>
        </div>
  );
}