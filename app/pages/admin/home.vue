<template>
  <div class="container mx-auto p-6">
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
        <Card class="bg-gradient-to-b from-white to-ghost-white group">
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-lg">
              <Icon :name="item.icon" />
              {{ item.title }}
            </CardTitle>
            <CardDescription>{{ item.description }}</CardDescription>
          </CardHeader>
          <CardContent> </CardContent>
          <CardFooter
            class="flex gap-4 px-6 text-muted-foreground group-hover:text-accent-foreground transition duration-200"
          >
            Ver más
            <Icon
              name="lucide:arrow-right"
              class="transition duration-200 group-hover:translate-x-1"
            />
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
    },
  ];

  const sessionStore = useSessionStore();
  const { logout } = sessionStore;
  const { session } = storeToRefs(sessionStore);
</script>
<style scoped></style>
