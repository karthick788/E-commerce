import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import NextAuth from 'next-auth';

// Create the main auth handler
const authHandler = NextAuth(authOptions);

// Custom handler to ensure JSON responses
const handler = async (req: Request, ctx: any) => {
  try {
    // Handle API routes
    const url = new URL(req.url);
    
    // Special handling for session endpoint
    if (url.pathname.endsWith('/api/auth/session') && req.method === 'GET') {
      const session = await getServerSession(authOptions);
      return NextResponse.json(session || { user: null, expires: null });
    }
    
    // For all other auth routes, return NextAuth's response as-is.
    // This preserves redirects (302) required by OAuth callbacks.
    const res = await authHandler(req, ctx);
    return res;
  } catch (error) {
    console.error('Auth route error:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Authentication error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};

export { handler as GET, handler as POST };


// This is the main authentication route handler for NextAuth.js
// It handles all authentication-related requests including:
// - Email/password login
// - OAuth providers (Google, etc.)
// - Session management
// - CSRF protection
// - JWT token generation and validation
