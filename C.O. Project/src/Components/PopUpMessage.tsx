import { useNavigate } from "react-router-dom";
import styles from "./styles/PopUp.module.css";

interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function PopupMessage({ title, message, onClose }: PopupProps) {
    const navigate = useNavigate();
    return (
        <div className={styles.popupWrapper}>
            <div className={styles.popupBackground}>
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>
                    Regresar
                </button>
                <button onClick={() => navigate("/dashboard")}>
                    Confirmar
                </button>
            </div>
        </div>
  );
}