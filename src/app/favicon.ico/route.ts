import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect old favicon.ico requests to the new icon.svg
  return NextResponse.redirect(new URL('/icon.svg', request.url), 301);
}
