import SendLetter from "./SendLetter";
import Inbox from "./Inbox";

export default function MailApp({ user }) {
  return (
    <div>
      <h1>{user}'s Mailbox</h1>

      <Inbox user={user} />
      <SendLetter user={user} />
    </div>
  );
}