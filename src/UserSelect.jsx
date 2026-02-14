export default function UserSelect({ setUser }) {
  return (
    <div>
      <h2>Who are you?</h2>

      <button onClick={() => setUser("Josh")}>
        Sign in as Josh
      </button>

      <button onClick={() => setUser("Avery")}>
        Sign in as Her
      </button>
    </div>
  );
}