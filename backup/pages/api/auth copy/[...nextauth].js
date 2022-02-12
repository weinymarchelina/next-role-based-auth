import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
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
    // async signIn({ account, profile }) {
    //   const { email, name, picture } = profile;
    //   const user = {
    //     email,
    //     name,
    //     picture,
    //   };

    //   console.log(user);
    //   return true;
    // },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      token.role = "employee";
      return token;
    },
    async session({ session, token, user }) {
      session.user.role = token.role;
      // console.log(session);
      return session;
    },
  },
});
