import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SendLetter({ user }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
const [message, setMessage] = useState("");

  const recipient = user === "josh" ? "her" : "josh";

  const sendLetter = async () => {
    try {
      let imageURL = null;

    //   if (image) {
    //     const imageRef = ref(
    //       storage,
    //       `letters/${Date.now()}_${image.name}`
    //     );

    //     await uploadBytes(imageRef, image);
    //     imageURL = await getDownloadURL(imageRef);
    //   }

      await addDoc(collection(db, "letters"), {
        sender: user,
        recipient,
        title,
        message,
        imageURLs: imageURL ? [imageURL] : [],
        opened: false,
        timestamp: serverTimestamp()
      });

      setText("");
      setImage(null);
      alert("Letter sent!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Send Letter</h3>

      <input
        placeholder="Letter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={sendLetter}>
        Send
      </button>
    </div>
  );
}