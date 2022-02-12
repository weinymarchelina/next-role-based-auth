import React, { useState } from "react";
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import { setCookies } from "cookies-next";

const Owner = ({ user }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await axios.post("/api/status/register", {
      name,
      phone,
      email,
      password,
    });
    const { businessForm } = result.data;

    if (businessForm) {
      const data = {
        ...businessForm,
        role: "Owner",
      };

      console.log(data);
      setCookies("status", data);

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");

      signIn(null, {
        callbackUrl: `${window.location.origin}/`,
      });
    } else {
      throw new Error("This email has already been taken");
    }
  };
  return (
    <div>
      <h1>Business Form</h1>

      {!user && (
        <form onSubmit={handleSubmit}>
          <label>{`Business's Name`}</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <br />
          <br />
          <label>Phone Number</label>
          <br />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <br />
          <br />
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <br />
          <br />
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br />
          <br />

          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
};

export default Owner;

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
