const icons = {
  error: "❌",
  success: "✅",
  info: "ℹ️",
  warning: "⚠️",
};

const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span>{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", opacity: 0.6 }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
