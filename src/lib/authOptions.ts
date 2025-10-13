import { NextAuthOptions, User as NextAuthUser, Session, DefaultSession } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';
import { connectToDB } from '@/lib/db';
import clientPromise from './mongodb';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'user' | 'admin';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'user' | 'admin';
  }

  // Extend EventCallbacks to include error event
  interface EventCallbacks {
    error: (message: { error: Error }) => Promise<void> | void;
  }
}

// Extend the JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      // Allow linking Google to an existing account with the same email
      allowDangerousEmailAccountLinking: true,
    }),

    // Credentials Provider (email/password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          await connectToDB();
          const emailToFind = String(credentials.email).toLowerCase().trim();
          console.log('🔍 Looking up user:', emailToFind);

          // Find user by email (normalized to lowercase)
          const user = await User.findOne({ email: emailToFind }).lean();
          
          if (!user) {
            console.log('❌ User not found');
            throw new Error('Invalid email or password');
          }

          // For OAuth users without a password
          if (user.provider !== 'local') {
            console.log('⚠️ Account uses OAuth login');
            throw new Error(`Please sign in with ${user.provider}`);
          }

          // Compare password
          console.log('🔐 Comparing password...');
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          console.log('🔑 Password validation result:', isMatch ? 'Valid' : 'Invalid');

          if (!isMatch) {
            console.error('❌ Password comparison failed');
            throw new Error('Invalid email or password');
          }

          // Return user data for the session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error('❌ Authentication error:', error);
          throw error;
        }
      }
    }),
  ],

  // Database adapter
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>) as Adapter,

  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Logger configuration for development
  logger: (() => {
    if (process.env.NODE_ENV === 'development') {
      return {
        error(code: any, metadata: any) {
          console.error('Auth error:', { code, metadata });
        },
        warn(code: string) {
          console.warn('Auth warning:', code);
        },
        debug(code: string, metadata: any) {
          console.log('Auth debug:', { code, metadata });
        },
      };
    }
    return undefined;
  })(),

  // Custom pages
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    newUser: '/',
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT Callback - Token:', { token, user, account });
      
      // Initial sign in
      if (account && user) {
        console.log('Initial sign in - User:', user);
        return {
          ...token,
          id: user.id,
          role: user.role || 'user',
          accessToken: account.access_token,
        };
      }
      
      // Update token with user data
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
      }
      
      return token;
    },

    async session({ session, token }) {
      console.log('Session Callback - Token:', token);
      
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as 'user' | 'admin') || 'user';
        session.accessToken = token.accessToken;
      }
      
      console.log('Session Callback - Final Session:', session);
      return session;
    },

    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === 'google') {
        try {
          await connectToDB();
          console.log('🔍 Google OAuth sign in attempt:', { email: user.email });

          if (!user.email) {
            throw new Error('No email provided by Google');
          }

          // Check if user exists
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if doesn't exist
            const newUser = new User({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: true,
              provider: 'google',
              role: 'user',
            });

            await newUser.save();
            console.log('✅ New Google user created:', user.email);
          } else {
            // Update existing user's provider if needed
            if (existingUser.provider !== 'google') {
              existingUser.provider = 'google';
              existingUser.emailVerified = true;
              await existingUser.save();
              console.log('🔄 Updated user provider to Google:', user.email);
            }
          }

          return true;
        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          return false;
        }
      }
      return true;
    },
  },

  // Security settings
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  // Events
  events: {
    async signIn(message) {
      console.log('✅ User signed in:', {
        email: message.user.email,
        provider: message.account?.provider
      });
    },
    async signOut(message) {
      console.log('👋 User signed out:', {
        email: message.token?.email,
        sessionId: message.token?.sid
      });
    },
    async error({ error }) {
      console.error('❌ Auth error:', {
        message: error.message,
        code: 'code' in error ? (error as any).code : 'UNKNOWN_ERROR',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    },
  },
};

export default authOptions;