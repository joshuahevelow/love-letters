import "./HomePage.css";
import { useEffect, useState, useRef } from "react";

export default function HomePage({ setView, hasUnread, user, logout }) {
  const [toggle, setToggle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    if (!hasUnread) return;

    const interval = setInterval(() => {
      setToggle((prev) => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, [hasUnread]);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);


  return (
    <div className="corkboard">

      <div className="user-menu" ref={menuRef}>
        <div
          className="user-box"
          onClick={() => setMenuOpen((s) => !s)}
          role="button"
        >
          <span className="user-text">{user}'s Letters</span>
          <span className={`user-arrow ${menuOpen ? "open" : ""}`}>▾</span>
        </div>

        {menuOpen && (
          <div className="user-dropdown" onClick={() => { setMenuOpen(false); logout && logout(); }}>
            Sign out
          </div>
        )}
      </div>

      <div className="polaroid-grid">

        {/* --- STATIC POLAROIDS --- */}
        <img src="/staticPolaroid1.png" className="polaroid" />

        <img
          src={hasUnread ? toggle ? "/closedEnvelopePolaroid.png" : "/fullEnvelopePolaroid.png" : "/openEnvelopePolaroid.png"}
          className="polaroid clickable"
          onClick={() => setView("inbox")}
        />

        <img src="/staticPolaroid2.png" className="polaroid" />

        <img
          src="/createPolaroid.png"
          className="polaroid clickable"
          onClick={() => setView("send")}
        />

        <img src="/staticPolaroid3.png" className="polaroid" />

        {/* --- CLICKABLE FEATURES --- */}

        <img
          src="/archivePolaroid.png"
          className="polaroid clickable"
          onClick={() => setView("archive")}
        />

      </div>

    </div>
  );
}