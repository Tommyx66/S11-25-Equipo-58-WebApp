import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Tus rutas protegidas
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/carrito(.*)',
  '/api/v1/usuarios/me'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 1. Resolvemos la promesa y guardamos el objeto
    const authObject = await auth();
    
    // 2. Verificamos "a mano" si NO hay usuario
    if (!authObject.userId) {
      // 3. Si no hay usuario, lo mandamos al login nosotros mismos
      return authObject.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};