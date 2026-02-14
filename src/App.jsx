import { useState } from "react";
import UserSelect from "./UserSelect";
import MailApp from "./MailApp";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <MailApp
      user={user}
      setUser={(u) => {
        if (u) localStorage.setItem("user", u);
        else localStorage.removeItem("user");
        setUser(u);
      }}
      logout={logout}
    />
  );
}

export default App;