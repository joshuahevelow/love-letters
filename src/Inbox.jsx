import { useEffect, useState } from "react";
import Letter from "./Letter";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Inbox({ user }) {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "letters"),
      where("recipient", "==", user),
      where("opened", "==", false)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setLetters(data);
    });

    return () => unsub();
  }, [user]);

  const openLetter = async (letter) => {
    setSelectedLetter(letter);

    await updateDoc(doc(db, "letters", letter.id), {
      opened: true
    });
  };

  return (
    <div>
      <h3>Inbox</h3>

      {letters.length === 0 && <p>No mail</p>}

      {letters.map((letter) => (
        <div key={letter.id}>
          <p><strong>{letter.title}</strong></p>
          <p>From: {letter.sender}</p>

          {letter.imageURLs?.map((url) => (
            <img key={url} src={url} width="150" />
          ))}

          <button onClick={() => openLetter(letter)}>
            Open
          </button>
        </div>
      ))}
      {selectedLetter && (
        <Letter
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
        />
      )}
    </div>
  );
}