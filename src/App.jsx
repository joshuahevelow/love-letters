import { useState } from "react";
import UserSelect from "./UserSelect";
import MailApp from "./MailApp";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return (
      <UserSelect
        setUser={(u) => {
          localStorage.setItem("user", u);
          setUser(u);
        }}
      />
    );
  }

  return <MailApp user={user} logout={logout} />;
}

export default App;