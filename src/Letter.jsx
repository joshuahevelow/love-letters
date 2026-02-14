import "./Letter.css";

export default function Letter({ letter, onClose }) {
  if (!letter) return null;

  return (
    <div className="letter-overlay">

      <div className="letter-container">

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>{letter.title}</h2>

        <p className="meta">
          From: {letter.sender}
        </p>

        {letter.timestamp && (
          <p className="timestamp">
            {letter.timestamp.toDate().toLocaleString()}
          </p>
        )}

        <hr />

        <p className="letter-text">
          {letter.message}
        </p>

      </div>

    </div>
  );
}