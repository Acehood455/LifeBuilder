import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { routeAccessMap } from './lib/settings';
import { NextResponse } from 'next/server';

const matchers = Object.keys(routeAccessMap).map(route => ({
  matcher: createRouteMatcher ([route]),
  allowedRoles: routeAccessMap[route]
}))

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // If no session or no role, redirect to sign-in (or send 401 if API)
      if (!role) {
        if (req.nextUrl.pathname.startsWith('/api')) {
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

      // Role exists but not allowed
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Skip Clerk for /api/assessments/:id/results
    '/api/:path((?!assessments/\\d+/results).*)',

  ],
};