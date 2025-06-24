<script setup lang="ts">
  import DropdownMenu from "./ui/dropdown-menu/DropdownMenu.vue";
  import DropdownMenuContent from "./ui/dropdown-menu/DropdownMenuContent.vue";
  import DropdownMenuItem from "./ui/dropdown-menu/DropdownMenuItem.vue";
  import DropdownMenuTrigger from "./ui/dropdown-menu/DropdownMenuTrigger.vue";
  import Sidebar from "./ui/sidebar/Sidebar.vue";
  import SidebarContent from "./ui/sidebar/SidebarContent.vue";
  import SidebarGroup from "./ui/sidebar/SidebarGroup.vue";
  import SidebarGroupContent from "./ui/sidebar/SidebarGroupContent.vue";
  import SidebarGroupLabel from "./ui/sidebar/SidebarGroupLabel.vue";
  import SidebarMenu from "./ui/sidebar/SidebarMenu.vue";
  import SidebarMenuButton from "./ui/sidebar/SidebarMenuButton.vue";
  import SidebarMenuItem from "./ui/sidebar/SidebarMenuItem.vue";

  const items = [
    {
      title: "Inicio",
      url: "/",
      icon: "lucide:house",
    },
    {
      title: "Inscribete!",
      url: "/inscripcion",
      icon: "lucide:clipboard-check",
    },
  ];

  const sessionStore = useSessionStore();
  const { logout } = sessionStore;
  const { session } = storeToRefs(sessionStore);
</script>

<template>
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
              <SidebarMenuButton class=" justify-between">
                <span class="flex items-center gap-2">
                  <Icon name="lucide:user" /> {{ session?.username }}
                </span>
                <Icon name="lucide:chevrons-up-down" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-(--reka-popper-anchor-width)"
            >
              <DropdownMenuItem as-child>
                <NuxtLink to="/admin/home">
                  <span>Administración</span>
                  <Icon name="lucide:layout-dashboard" />
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem @click="logout">
                <span>Cerrar sesión</span>
                <Icon
                  name="lucide:log-out"
                  class="text-destructive-foreground"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarFooter v-else-if="session && session.role === 'PARTICIPANT'">
      <Alert>
        <Icon name="lucide:triangle-alert" class="!text-amber-400" />
        <AlertTitle>Sesión activa</AlertTitle>
        <AlertDescription>
          Has iniciado sesion!
        </AlertDescription>
      </Alert>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton class=" justify-between">
                <span class="flex items-center gap-2">
                  <Icon name="lucide:user" /> {{ session?.username }}
                </span>
                <Icon name="lucide:chevrons-up-down" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-(--reka-popper-anchor-width)"
            >
              <DropdownMenuItem as-child>
                <NuxtLink to="/participant">
                  <span>Tu Perfil</span>
                  <Icon name="lucide:layout-dashboard" />
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem @click="logout">
                <span>Cerrar sesión</span>
                <Icon
                  name="lucide:log-out"
                  class="text-destructive-foreground"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
