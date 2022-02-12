import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const createOptions = (req) => ({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  jwt: {
    encryption: true,
  },
  session: { jwt: true },
  secret: process.env.SECRET,
  database: process.env.DB_STRING,
  theme: {
    colorScheme: "light",
    brandColor: "#202020", // Hex color code
    logo: "/vercel.svg", // Absolute URL to image
  },
  session: { jwt: true },
  callbacks: {
    async signIn({ account, profile }) {
      const { email, name, picture } = profile;
      const user = {
        email,
        name,
        picture,
      };

      console.log(user);
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      token.role = "employee";

      if (req.url === "/api/auth/session?update") {
        // hit the DB and return token with updated values. e.g.:
        token.role = "owner";
      }
      return token;
    },
    async session({ session, token, user }) {
      // session.user.role = token.role;
      // console.log(session);
      console.log(token);
      session.user = {
        ...session.user,
        role: token.role,
      };
      return session;
    },
  },
});

export default async (req, res) => {
  return NextAuth(req, res, createOptions(req));
};
