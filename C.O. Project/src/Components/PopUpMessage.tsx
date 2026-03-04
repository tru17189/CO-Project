import { useNavigate } from "react-router-dom";

interface PopupProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function PopupMessage({ title, message, onClose }: PopupProps) {
    const navigate = useNavigate();
    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000,
        }}>
            <div style={{
            background: "#fff", borderRadius: 8, padding: "32px 28px",
            width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 20 }}>{title}</h2>
            <p style={{ margin: "0 0 24px", color: "#555", lineHeight: 1.5 }}>{message}</p>
            <button
                onClick={onClose}
                style={{
                background: "#111", color: "#fff", border: "none",
                borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 14,
                }}
            >
                Regresar
            </button>
            <button 
                style={{
                background: "#111", color: "#fff", border: "none",
                borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 14,
                }}
                onClick={() => navigate("/dashboard")}>Confirmar</button>
            </div>
        </div>
  );
}