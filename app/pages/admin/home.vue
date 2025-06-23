<template>
  <div class="container mx-auto p-5">
    <h1 class="text-2xl font-bold">Administración</h1>
    <section class="py-2 space-y-2">
      <h5
        class="text-xs text-muted-foreground uppercase font-light tracking-wider"
      >
        Sesión iniciada como:
      </h5>
      <h2 class="text-lg font-medium text-accent-foreground font-mono">
        {{ session.username }}
      </h2>
      <ul>
        <li>
          <Button @click="logout" size="sm" variant="secondary" class="">
            <Icon name="lucide:log-out" />
            Cerrar sesión
          </Button>
        </li>
      </ul>
    </section>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      <NuxtLink v-for="(item, index) in linkItems" :key="index" :to="item.link">
        <Card
          class="bg-gradient-to-b from-transparent to-primary/40 group hover:via-primary/10 via-primary/5 transition duration-200 dark:from-primary/20 dark:to-transparent dark:hover:via-primary/10 dark:via-primary/5"
        >
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-lg">
              <Icon :name="item.icon" />
              {{ item.title }}
            </CardTitle>
            <CardDescription>{{ item.description }}</CardDescription>
          </CardHeader>
          <CardContent> </CardContent>
          <CardFooter
            class="flex gap-2 flex-col items-start px-6 text-muted-foreground group-hover:text-accent-foreground transition duration-200"
          >
            <span class="text-sm">Accesos rapidos</span>
            <div class="space-x-2">
              <Button
                v-for="(shortcut, sIndex) in item.shortcuts"
                :key="sIndex"
                @click.stop="navigateTo(shortcut.link)"
                size="sm"
                variant="secondary"
              >
                <Icon :name="shortcut.icon" />
                {{ shortcut.name }}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </NuxtLink>
    </section>
  </div>
</template>
<script setup>
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "~/components/ui/card";

  const linkItems = [
    {
      title: "Inscripciones",
      description:
        "Verificar y gestionar las inscripciones de los participantes",
      icon: "lucide:clipboard-list",
      link: "/admin/inscriptions",
      shortcuts: [
        { name: "Ver", icon: "lucide:eye", link: "/admin/inscriptions" },
        { name: "Crear", icon: "lucide:plus", link: "/admin/inscriptions/new" },
      ],
    },
    {
      title: "Modulos",
      description: "Gestionar módulos disponibles dentro del Centro",
      icon: "lucide:building",
      link: "/admin/modules",
      shortcuts: [
        { name: "Ver", icon: "lucide:eye", link: "/admin/modules" },
        { name: "Crear", icon: "lucide:plus", link: "/admin/creacionModulos" },
      ],
    },
  ];

  const sessionStore = useSessionStore();
  const { logout } = sessionStore;
  const { session } = storeToRefs(sessionStore);
</script>
<style scoped></style>
