import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    publishableKey:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk',
    secretKey:
      process.env.CLERK_SECRET_KEY ||
      'sk_test_dummy_secret_key_for_build_step_00000000000000',
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|kml|json)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
