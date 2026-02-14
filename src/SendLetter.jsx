import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./SendLetter.css";

export default function SendLetter({ user }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const recipient = user === "Josh" ? "Avery" : "Josh";

  const sendLetter = async () => {
    if (!title.trim() || !message.trim()) {
      setErrorMessage("Please fill in both title and message");
      return;
    }

    try {
      await addDoc(collection(db, "letters"), {
        sender: user,
        recipient,
        title,
        message,
        imageURLs: [],
        opened: false,
        archived: false,
        timestamp: serverTimestamp()
      });

      setSuccessMessage("Letter sent!");
      setTitle("");
      setMessage("");
      setErrorMessage("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error sending letter. Please try again.");
    }
  };

  return (
    <div className="send-letter-container">
      {errorMessage && (
        <div className="error-popup">
          <div className="error-popup-content">
            <div className="error-popup-title">⚠️ Error</div>
            <div className="error-popup-message">{errorMessage}</div>
            <button
              className="error-popup-btn"
              onClick={() => setErrorMessage("")}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <div className="send-letter-card">
        {successMessage && (
          <div className="send-letter-success">{successMessage}</div>
        )}

        <div>
          <div className="send-letter-title-label">Title</div>
          <input
            className="send-letter-title-input"
            type="text"
            placeholder="Enter a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <div className="send-letter-message-label">Message</div>
          <textarea
            className="send-letter-message-input"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="send-letter-button-group">
          <button className="send-letter-btn" onClick={sendLetter}>
            Send Letter
          </button>
        </div>
      </div>
    </div>
  );
}