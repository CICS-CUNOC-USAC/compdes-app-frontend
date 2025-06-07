import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";

export default defineNuxtRouteMiddleware((to, _from) => {
  const sessionStore = useSessionStore();
  const { session, role } = storeToRefs(sessionStore);

  // Only protect /admin routes
  if (!to.path.startsWith("/admin")) {
    return; // let everything else through
  }

  // Allow the login page
  if (to.path === "/admin/login") {
    return;
  }

  // If not logged in, go to home
  if (!session.value) {
    return navigateTo("/");
  }

  // If logged in but not an admin, also go to home
  if (role.value !== "ADMIN") {
    return navigateTo("/");
  }
});
