import { getSession, signOut } from "next-auth/react";
import axios from "axios";

export default function Home({ user }) {
  console.log(user);

  const handleClick = async () => {
    try {
      await axios.get("/api/auth/session?update");
      return;
      // window.location.reload();
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <div>
      {user ? <p>Welcome {user.name}</p> : <p>Please Sign in</p>}

      {user && (
        <>
          <button onClick={handleClick}>Be owner</button>
          <button
            onClick={() => {
              signOut({ callbackUrl: `${window.location.origin}/` });
            }}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: { user: null },
    };
  }

  return {
    props: { user: session.user },
  };
}
