import { useState } from "react";
import SendLetter from "./SendLetter";
import Inbox from "./Inbox";
import Archive from "./Archive";
import HomePage from "./HomePage";
import { useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MailApp({ user, logout }) {
  const [view, setView] = useState("home");
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
  const q = query(
    collection(db, "letters"),
    where("recipient", "==", user),
    where("opened", "==", false)
  );

  const unsub = onSnapshot(q, (snapshot) => {
    setHasUnread(!snapshot.empty);
  });

  return () => unsub();
}, [user]);

  return (
    <div>

      {view !== "home" && (
        <button className="back-to-board" onClick={() => setView("home")}>
          ←
        </button>
      )}

      {/* <button onClick={logout}>Sign Out</button> */}

      {view === "home" && <HomePage setView={setView} hasUnread={hasUnread}/>}
      {view === "inbox" && <Inbox user={user} />}
      {view === "send" && <SendLetter user={user} />}
      {view === "archive" && <Archive user={user} />}

    </div>
  );
}