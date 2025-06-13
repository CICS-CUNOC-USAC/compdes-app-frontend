<script setup lang="ts">
import Sidebar from './ui/sidebar/Sidebar.vue';
import SidebarContent from './ui/sidebar/SidebarContent.vue';
import SidebarGroup from './ui/sidebar/SidebarGroup.vue';
import SidebarGroupContent from './ui/sidebar/SidebarGroupContent.vue';
import SidebarGroupLabel from './ui/sidebar/SidebarGroupLabel.vue';
import SidebarMenu from './ui/sidebar/SidebarMenu.vue';
import SidebarMenuButton from './ui/sidebar/SidebarMenuButton.vue';
import SidebarMenuItem from './ui/sidebar/SidebarMenuItem.vue';

const items = [
  {
    title: "Home",
    url: "/",
    icon: "lucide:user",
  },
  {
    title: "Inscribete!",
    url: "/inscripcion",
    icon: "lucide:user",
  },
];
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <a :href="item.url">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
