import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";

export default function Archive({ user }) {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "letters"),
      where("recipient", "==", user),
      where("opened", "==", true),
      orderBy("timestamp", "desc")
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

  const deleteLetter = async (id) => {
    if (!confirm("Delete this letter?")) return;

    try {
      await deleteDoc(doc(db, "letters", id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Archive</h3>

      {letters.length === 0 && <p>No archived letters</p>}

      {letters.map((letter) => (
        <div key={letter.id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
          <p><strong>From:</strong> {letter.sender}</p>

          <p>
            <strong>Date:</strong>{" "}
            {letter.timestamp?.toDate().toLocaleString()}
          </p>

          <p>{letter.text}</p>

          <button onClick={() => deleteLetter(letter.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}