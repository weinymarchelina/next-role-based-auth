import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getCookie, removeCookies } from "cookies-next";
const User = require("../../../models/User");
import dbConnect from "../../../db/database";

dbConnect();

const createOptions = (req, res) => ({
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
    brandColor: "#202020",
    logo: "/vercel.svg", // Absolute URL to image
  },
  session: { jwt: true },
  callbacks: {
    async jwt({ token, account }) {
      // if authed then just skip the checking or registering process
      if (!getCookie("status", { req, res })) {
        return token;
      }

      // if unauthed then start checking or registering:
      const status = await JSON.parse(getCookie("status", { req, res }));
      const { businessId, productId, orderId, role } = status;

      if (account) {
        token.accessToken = account.access_token;
      }

      // no businessId means the user is an old user,  user with businessId means they are new user
      if (businessId) {
        const userData = {
          name: token.name,
          email: token.email,
          picture: token.picture,
          role,
          businessId,
        };

        token.role = role;
        token.businessId = businessId;
        token.productId = productId;
        token.orderId = orderId;

        const user = await new User(userData).save();
        token.userId = user._id;

        removeCookies("status", { req, res });
        return token;
      }

      // checking whether the user is an old or new user
      const oldUser = await User.findOne({ email: token.email });
      if (oldUser.businessId) {
        // getting the businessId back for the old user
        const { businessId, productId, orderId, _id, role } = oldUser;
        token.businessId = businessId;
        token.productId = productId;
        token.orderId = orderId;
        token.userId = _id;
        token.role = role;
        removeCookies("status", { req, res });
        return token;
      } else {
        return true;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user.role = token.role;
      session.user.businessId = token.businessId;
      session.user.productId = token.productId;
      session.user.orderId = token.orderId;
      session.user.userId = token.userId;

      return session;
    },
  },
});

export default async (req, res) => {
  return NextAuth(req, res, createOptions(req, res));
};
