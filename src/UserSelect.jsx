export default function UserSelect({ setUser }) {
  return (
    <div>
      <h2>Who are you?</h2>

      <button onClick={() => setUser("josh")}>
        Sign in as Josh
      </button>

      <button onClick={() => setUser("her")}>
        Sign in as Her
      </button>
    </div>
  );
}