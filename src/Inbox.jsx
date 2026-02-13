import { useEffect, useState } from "react";
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
          <p>{letter.text}</p>

          {letter.imageURLs?.map((url) => (
            <img key={url} src={url} width="150" />
          ))}

          <button onClick={() => openLetter(letter)}>
            Open
          </button>
        </div>
      ))}
    </div>
  );
}