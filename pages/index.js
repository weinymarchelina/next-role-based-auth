import { getSession, signOut, signIn } from "next-auth/react";
import { setCookies } from "cookies-next";
import Link from "next/link";

export default function Home({ user }) {
  console.log("current user info");
  console.log(user);

  return (
    <div>
      {user ? <p>Welcome {user.name}</p> : <p>Please Select Your Role</p>}

      {!user && (
        <div>
          <h1>Decide your Roles</h1>
          <p>{`Welcome user, let's set your roles!`}</p>
          <p>Are you a business owner or an employee?</p>
          <button>
            <Link href="/roles/owner">{`I'm a business owner`}</Link>
          </button>
          <button>
            <Link href="/roles/employee">{`I'm an employee`}</Link>
          </button>
          <button
            onClick={() => {
              setCookies("status", {
                role: "Unknown",
              });
              signIn(null, {
                callbackUrl: `${window.location.origin}/`,
              });
            }}
          >
            I'm an old user
          </button>
        </div>
      )}

      {user && (
        <button
          onClick={() => {
            signOut({ callbackUrl: `${window.location.origin}/` });
          }}
        >
          Sign Out
        </button>
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
