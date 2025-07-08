<template>
  <div>
    <SidebarProvider :default-open="false">
      <!-- <AppSidebar /> -->

      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menú de navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in items" :key="item.title">
                  <SidebarMenuButton asChild>
                    <NuxtLink :to="item.url">
                      <Icon :name="item.icon" />
                      <span>{{ item.title }}</span>
                    </NuxtLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter v-if="session && session.role === 'ADMIN'">
          <Alert>
            <Icon name="lucide:triangle-alert" class="!text-amber-400" />
            <AlertTitle>Sesión activa</AlertTitle>
            <AlertDescription>
              Has iniciado sesión como usuario adminsitrativo:
            </AlertDescription>
          </Alert>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton class="justify-between">
                    <span class="flex items-center gap-2">
                      <Icon name="lucide:user" /> {{ session?.username }}
                    </span>
                    <Icon name="lucide:chevrons-up-down" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" class="w-(--reka-popper-anchor-width)">
                  <DropdownMenuItem as-child>
                    <NuxtLink to="/admin/home">
                      <span>Administración</span>
                      <Icon name="lucide:layout-dashboard" />
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="logout">
                    <span>Cerrar sesión</span>
                    <Icon name="lucide:log-out" class="text-destructive-foreground" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main class="w-full min-h-screen flex flex-col">
        <div
          class="flex py-2.5 px-3.5 z-50 justify-between gap-x-2 sticky top-0 bg-background/70 backdrop-blur-xs border-b"
          :class="{
            'border-b-border': hasScrolled,
            'border-b-transparent': !hasScrolled,
          }">
          <section class="flex items-center gap-x-1">
            <SidebarTrigger>
              <template #icon>
                <Icon name="lucide:menu" class="size-4" />
              </template>
            </SidebarTrigger>
            <NuxtLink to="/admin/home" class="inline-block uppercase font-medium text-sm text-foreground">
              <CompdesLogo class="size-4.5 inline-block mr-1 mb-0.5 fill-foreground" />
              ADMIN
            </NuxtLink>
            <h2 class="text-muted-foreground text-sm uppercase  flex items-center gap-1">
              <Icon name="lucide:chevron-right" class="size-4 transition duration-300 ease-in-out" :class="{
                'opacity-100 translate-x-0': hasScrolled,
                'opacity-0 -translate-x-2': !hasScrolled,
              }" v-if="$route.meta.title" />
              <span :class="{
                'opacity-100 translate-y-0': hasScrolled,
                'opacity-0 translate-y-2': !hasScrolled,
              }" class="transition duration-300 ease-in-out">
                {{ $route.meta.title || "" }}
              </span>
            </h2>
          </section>
        </div>
        <div class="flex-1">
          <NuxtPage />
        </div>
      </main>
    </SidebarProvider>
  </div>
</template>
<script setup>
import CompdesLogo from "~/components/partials/CompdesLogo.vue";
import Sidebar from "~/components/ui/sidebar/Sidebar.vue";
import SidebarContent from "~/components/ui/sidebar/SidebarContent.vue";
import SidebarGroup from "~/components/ui/sidebar/SidebarGroup.vue";
import SidebarGroupContent from "~/components/ui/sidebar/SidebarGroupContent.vue";
import SidebarGroupLabel from "~/components/ui/sidebar/SidebarGroupLabel.vue";
import SidebarMenu from "~/components/ui/sidebar/SidebarMenu.vue";
import SidebarMenuButton from "~/components/ui/sidebar/SidebarMenuButton.vue";
import SidebarMenuItem from "~/components/ui/sidebar/SidebarMenuItem.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";

const items = [
  {
    title: "Inicio",
    url: "/admin/home",
    icon: "lucide:house",
  },
  {
    title: "Inscripciones",
    url: "/admin/inscriptions",
    icon: "lucide:clipboard-check",
  },
];

const sessionStore = useSessionStore();
const { logout } = sessionStore;
const { session } = storeToRefs(sessionStore);

// test
const hasScrolled = ref(false);
onMounted(() => {
  window.addEventListener("scroll", () => {
    hasScrolled.value = window.scrollY > 100;
  });
});
onUnmounted(() => {
  window.removeEventListener("scroll", () => {
    hasScrolled.value = false;
  });
});
</script>
<style scoped></style>
