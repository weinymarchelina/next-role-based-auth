import { useEffect } from "react";
import { providers, getSession } from "next-auth/react";
import Router from "next/router";

const Login = ({ providers, session }) => {
  useEffect(() => {
    if (session) return Router.push("/");
  }, [session]);

  console.log(providers);

  if (session) return null;

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};

Login.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
    session: await getSession(context),
  };
};

export default Login;
