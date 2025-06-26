import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";

export default defineNuxtRouteMiddleware((to, _from) => {
  const sessionStore = useSessionStore();
  const { session, role } = storeToRefs(sessionStore);

   if (session.value) {
    if (to.path === "/admin/login" && role.value === "ADMIN") {
      return navigateTo("/admin/home");
    }
    if (to.path === "/login" && role.value === "PARTICIPANT") {
      return navigateTo("/participant");
    }
  }

  // Only protect /admin and /participant routes
  if (!to.path.startsWith("/admin") && !to.path.startsWith("/participant")) {
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

  if (to.path.startsWith("/admin") && role.value !== "ADMIN") {
    return navigateTo("/");
  }

  if (to.path.startsWith("/participant") && role.value !== "PARTICIPANT") {
    return navigateTo("/");
  }
});
