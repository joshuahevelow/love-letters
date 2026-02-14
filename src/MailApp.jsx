import { useState } from "react";
import SendLetter from "./SendLetter";
import Inbox from "./Inbox";
import Archive from "./Archive";
import HomePage from "./HomePage";
import { useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MailApp({ user, setUser, logout }) {
  const [view, setView] = useState("home");
  const [hasUnread, setHasUnread] = useState(false);

  // local auth fallback when `user` prop not supplied
  const [localUser, setLocalUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passcode, setPasscode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const effectiveUser = user || localUser;

  useEffect(() => {
    if (!effectiveUser) return;
    const q = query(
      collection(db, "letters"),
      where("recipient", "==", effectiveUser),
      where("opened", "==", false)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setHasUnread(!snapshot.empty);
    });

    return () => unsub();
  }, [effectiveUser]);

  const handleLogout = () => {
    // clear parent state if provided, then call external logout
    if (setUser) setUser(null);
    if (logout) logout();
    // always clear local state and return to home UI
    setLocalUser(null);
    setSelectedUser(null);
    setPasscode("");
    setView("home");
  };

  const credentials = {
    Josh: "muffin414",
    Avery: "smush109"
  };

  const tryLogin = () => {
    if (!selectedUser) {
      setErrorMessage("Select a user");
      return;
    }
    const expected = credentials[selectedUser];
    if (passcode === expected) {
      setLocalUser(selectedUser);
      if (setUser) setUser(selectedUser);
      setPasscode("");
      setSelectedUser(null);
      setErrorMessage("");
      setView("home");
    } else {
      setErrorMessage("Incorrect passcode");
    }
  };

  // if no effective user, show login UI
  if (!effectiveUser) {
    return (
      <div className="corkboard">
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
        <div className="login-card">
          <div className="login-title">Love Letters</div>
          <div className="login-subtitle">Select user:</div>

          <div className="login-avatars">
            <div
              className={`avatar ${selectedUser === "Josh" ? "selected" : ""}`}
              onClick={() => setSelectedUser("Josh")}
            >
              <img src="/josh_user.png" alt="Josh" />
            </div>

            <div
              className={`avatar ${selectedUser === "Avery" ? "selected" : ""}`}
              onClick={() => setSelectedUser("Avery")}
            >
              <img src="/avery_user.png" alt="Avery" />
            </div>
          </div>

          <div className="pass-row">
            <input
              className="passcode-input"
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            />

            <button className="login-btn" onClick={tryLogin}>Enter</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>

      {view !== "home" && (
        <button className="back-to-board" onClick={() => setView("home")}>
          ←
        </button>
      )}

      {view === "home" && <HomePage setView={setView} hasUnread={hasUnread} user={effectiveUser} logout={handleLogout} />}
      {view === "inbox" && <Inbox user={effectiveUser} />}
      {view === "send" && <SendLetter user={effectiveUser} />}
      {view === "archive" && <Archive user={effectiveUser} />}

    </div>
  );
}