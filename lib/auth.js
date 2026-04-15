
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './mongodb';
import User from './models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            email:    user.email,
            name:     user.name,
            image:    user.image,
            provider: 'google',
          });
        } else {
          await User.updateOne(
            { email: user.email },
            { $set: { name: user.name, image: user.image } }
          );
        }
        return true;
      } catch (err) {
        console.error('SignIn error:', err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) token.id = dbUser._id.toString();
        } catch (err) {
          console.error('JWT callback error:', err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },

  pages: {
    signIn: '/',
    error:  '/',
  },

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
