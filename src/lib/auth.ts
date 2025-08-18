import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/lib/neon/client';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await pool.connect();
        try {
          const result = await client.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [credentials.email]
          );

          const user = result.rows[0];

          if (user && bcrypt.compareSync(credentials.password, user.hashed_password)) {
            // Retorna o objeto do usuário para o NextAuth
            return { id: user.id, name: user.nome, email: user.email };
          } else {
            // Retorna nulo se as credenciais estiverem incorretas
            return null;
          }
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        } finally {
          client.release();
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (e.g. for email verification)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      // Adiciona o ID do usuário ao token JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Adiciona o ID do usuário à sessão
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};