import "./HomePage.css";
import { useEffect, useState} from "react";

export default function HomePage({ setView, hasUnread }) {
    const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!hasUnread) return;

    const interval = setInterval(() => {
      setToggle((prev) => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, [hasUnread]);


  return (
    <div className="corkboard">

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