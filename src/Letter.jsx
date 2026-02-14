import "./Letter.css";

export default function Letter({ letter, onClose, onArchive, isArchived, isPreview }) {
  if (!letter) return null;

  return (
    <div className="letter-overlay">

      <div className="letter-container">

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        {console.log(isPreview)}

        {!isPreview && (
          isArchived ? (
            <button className="delete-btn-letter" onClick={onArchive}>
              Delete
            </button>
          ) : (
            <button className="archive-btn" onClick={onArchive}>
              Archive
            </button>
          )
        )}

        <h2>{letter.title}</h2>

        <p className="meta">
          From: <span className="sender-name">{letter.sender}</span>
        </p>

        {letter.timestamp && (
          <p className="timestamp">
            {typeof letter.timestamp.toDate === 'function' 
              ? letter.timestamp.toDate().toLocaleString() 
              : letter.timestamp.toLocaleString()}
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