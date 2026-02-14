import "./Letter.css";

export default function Letter({ letter, onClose, onArchive, isArchived }) {
  if (!letter) return null;

  return (
    <div className="letter-overlay">

      <div className="letter-container">

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {isArchived ? (
          <button className="delete-btn-letter" onClick={onArchive}>
            Delete
          </button>
        ) : (
          <button className="archive-btn" onClick={onArchive}>
            Archive
          </button>
        )}

        <h2>{letter.title}</h2>

        <p className="meta">
          From: <span className="sender-name">{letter.sender}</span>
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