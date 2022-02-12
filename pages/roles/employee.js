import React, { useState } from "react";
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import { setCookies } from "cookies-next";

const Employee = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("/api/status/login", {
        email,
        password,
      });
      const { ids } = result.data;

      if (ids) {
        const data = {
          ...ids,
          role: "Employee",
        };

        console.log(data);
        setCookies("status", data);
        setEmail("");
        setPassword("");

        // const res = await axios.get("/api/auth/session");
        signIn(null, {
          callbackUrl: `${window.location.origin}/`,
        });
      } else {
        throw new Error("Email or password is incorrect");
      }
    } catch (err) {
      console.log(err);
      // throw new Error(err.response.data.msg);
    }
  };
  return (
    <div>
      <h1>{`Join to your business' account`}</h1>
      {!user && (
        <div className="body owner">
          <form onSubmit={handleSubmit}>
            <label>{`Business' Email`}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <br />
            <br />

            <br />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <br />
            <br />

            <button type="submit">Join</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Employee;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { user: null },
  };
}
