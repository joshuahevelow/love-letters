import { useEffect, useState } from "react";
import Letter from "./Letter";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
  getDocs
} from "firebase/firestore";
import "./Archive.css";

export default function Archive({ user }) {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Fix old letters that don't have archived field marked as true
  useEffect(() => {
    const fixOldArchivedLetters = async () => {
      try {
        const q = query(
          collection(db, "letters"),
          where("recipient", "==", user),
          where("opened", "==", true)
        );
        const snapshot = await getDocs(q);
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (!("archived" in data)) {
            updateDoc(doc.ref, { archived: false });
          }
        });
      } catch (error) {
        console.error("Error fixing old archived letters:", error);
      }
    };

    fixOldArchivedLetters();
  }, [user]);

  useEffect(() => {
    const q = query(
      collection(db, "letters"),
      where("recipient", "==", user),
      where("archived", "==", true),
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
    if (!confirm("Delete this letter permanently?")) return;

    try {
      // Remove from UI immediately for instant feedback
      setLetters(letters.filter(l => l.id !== id));
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
      
      // Update database
      await deleteDoc(doc(db, "letters", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete letter. Please try again.");
    }
  };

  const openLetter = async (letter) => {
    setSelectedLetter(letter);

    await updateDoc(doc(db, "letters", letter.id), {
      opened: true,
      archived: true
    });
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
    <div className="archive-container">
      <div className="archive-content">
        <h2 className="archive-title">Archive</h2>

        {letters.length === 0 && <p className="no-letters">No archived letters</p>}

        <div className="archived-letters">
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
          onArchive={() => {
            deleteLetter(selectedLetter.id);
            setSelectedLetter(null);
          }}
          isArchived={true}
        />
      )}
    </div>
  );
}