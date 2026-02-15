import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Letter from "./Letter";
import "./SendLetter.css";

export default function SendLetter({ user }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageURLs, setImageURLs] = useState([]); // ⭐ NEW
  const [uploading, setUploading] = useState(false); // ⭐ NEW
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const recipient = user === "Josh" ? "Avery" : "Josh";

  // ⭐ CLOUDINARY UPLOAD FUNCTION
  // const uploadImages = async (files) => {
  //   if (!files.length) return;

  //   setUploading(true);

  //   try {
  //     const uploadedUrls = [];

  //     for (let file of files) {
  //       const data = new FormData();
  //       data.append("file", file);
  //       data.append("upload_preset", "YOUR_UPLOAD_PRESET");

  //       const res = await fetch(
  //         "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
  //         {
  //           method: "POST",
  //           body: data
  //         }
  //       );

  //       const result = await res.json();
  //       uploadedUrls.push(result.secure_url);
  //     }

  //     setImageURLs((prev) => [...prev, ...uploadedUrls]);
  //   } catch (err) {
  //     console.error(err);
  //     setErrorMessage("Image upload failed");
  //   }

  //   setUploading(false);
  // };

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
        imageURLs, // ⭐ store images
        opened: false,
        archived: false,
        timestamp: serverTimestamp()
      });

      setSuccessMessage("Letter sent!");
      setTitle("");
      setMessage("");
      setImageURLs([]); // reset images
      setErrorMessage("");

      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error sending letter. Please try again.");
    }
  };

  const doShowPreview = () => {
    if (!title.trim() || !message.trim()) {
      setErrorMessage("Please fill in both title and message");
      return;
    }

    setErrorMessage("");
    setShowPreview(true);
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

        {/* ⭐ IMAGE UPLOAD UI
        <div style={{ marginTop: "15px" }}>
          <div className="send-letter-message-label">Images</div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => uploadImages(e.target.files)}
          />

          {uploading && <p>Uploading...</p>}

          {/* preview selected images
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {imageURLs.map((url, i) => (
              <img key={i} src={url} width="80" alt="preview" />
            ))}
          </div>
        </div> */}

        <div className="send-letter-button-group">
          <button
            className="send-letter-btn send-letter-preview-btn"
            onClick={doShowPreview}
          >
            Preview
          </button>
          <button className="send-letter-btn" onClick={sendLetter}>
            Send Letter
          </button>
        </div>
      </div>

      {showPreview && (
        <Letter
          letter={{
            id: "preview",
            sender: user,
            recipient,
            title,
            message,
            imageURLs, // ⭐ pass images to preview
            timestamp: new Date(),
            opened: false,
            archived: false
          }}
          onClose={() => setShowPreview(false)}
          onArchive={() => setShowPreview(false)}
          isArchived={false}
          isPreview={true}
        />
      )}
    </div>
  );
}