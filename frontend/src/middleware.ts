import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/carrito(.*)',
  '/api/v1/usuarios/me'
]);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();

  if (isProtectedRoute(req) && !authObj.userId) {
    return authObj.redirectToSignIn();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
