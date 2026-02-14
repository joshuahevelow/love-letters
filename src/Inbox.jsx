import { useEffect, useState } from "react";
import Letter from "./Letter";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  getDocs
} from "firebase/firestore";
import "./Inbox.css";

export default function Inbox({ user }) {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Fix old letters that don't have archived field
  useEffect(() => {
    const fixOldLetters = async () => {
      try {
        const q = query(
          collection(db, "letters"),
          where("recipient", "==", user)
        );
        const snapshot = await getDocs(q);
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (!("archived" in data)) {
            updateDoc(doc.ref, { archived: false });
          }
        });
      } catch (error) {
        console.error("Error fixing old letters:", error);
      }
    };

    fixOldLetters();
  }, [user]);

  useEffect(() => {
    const q = query(
      collection(db, "letters"),
      where("recipient", "==", user),
      where("archived", "==", false),
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

  const openLetter = async (letter) => {
    setSelectedLetter(letter);

    await updateDoc(doc(db, "letters", letter.id), {
      opened: true,
      archived: false
    });
  };

  const archiveLetter = async (letterId) => {
    try {
      // Remove from UI immediately for instant feedback
      setLetters(letters.filter(l => l.id !== letterId));
      setSelectedLetter(null);
      
      // Update database
      await updateDoc(doc(db, "letters", letterId), {
        archived: true
      });
      console.log("Letter archived successfully");
    } catch (error) {
      console.error("Error archiving letter:", error);
      alert("Failed to archive letter. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
    });
  };

  return (
    <div className="inbox-container">
      <div className="inbox-content">
        <h2 className="inbox-title">Inbox</h2>

        {letters.length === 0 && <p className="no-mail">No new mail</p>}

        <div className="letters-list">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="letter-item"
              onClick={() => openLetter(letter)}
            >
              <div className="letter-item-header">
                <h3 className="letter-title">{letter.title}</h3>
                <span className="letter-date">{formatDate(letter.timestamp)}</span>
              </div>
              <p className="letter-from">From: {letter.sender}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedLetter && (
        <Letter
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
          onArchive={() => archiveLetter(selectedLetter.id)}
          isArchived={false}
        />
      )}
    </div>
  );
}