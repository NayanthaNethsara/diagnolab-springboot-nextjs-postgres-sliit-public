import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define the NextAuth handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const res = await fetch("http://localhost:8080/api/auth/authenticate", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });

        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as typeof session.user;
      return session;
    },
  },
});

// Export GET and POST handlers as named exports
export { handler as GET, handler as POST };
