<template>
  <div class="container mx-auto p-5">
    <div class="">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/conferences">
          <Icon name="lucide:arrow-left" />
          Volver a Actividades
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:house" />
          Volver a Inicio
        </NuxtLink>
      </Button>

      <h1 class="text-2xl font-bold">Detalles de Actividad</h1>
    </div>

    <div v-if="error" class="text-red-600">Failed to load activity.</div>

    <LoaderIndicator v-if="status === 'pending'" />

    <div v-else class="mt-3">
      <h2
        class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4"
      >
        Acciones:
      </h2>
      <div class="mb-3 space-x-2 space-y-2">
        <DeleteItemDialog @confirm="">
          <Button size="sm" variant="destructive">
            <Icon name="lucide:trash" />
            Eliminar
          </Button>
        </DeleteItemDialog>
        <Button size="sm" variant="outline" as-child>
          <NuxtLink :to="`/admin/conferences/${activity?.id}/edit`">
            <Icon name="lucide:pencil" />
            Editar
          </NuxtLink>
        </Button>
      </div>
      <h2
        class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4"
      >
        Información:
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            <Icon class="inline mb-0.5" name="lucide:user" /> Nombre
          </h2>
          <p class="mt-1 text-lg">{{ activity?.name }}</p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            <Icon class="inline mb-0.5" name="lucide:info" /> Descripción
          </h2>
          <p class="mt-1 text-lg">{{ activity?.description }}</p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            <Icon class="inline mb-0.5" name="lucide:shapes" /> Tipo
          </h2>
          <Badge class="mt-1 text-base">{{ activity?.type }}</Badge>
        </div>

        <div class="md:col-span-2">
          <h2 class="font-semibold text-sm text-muted-foreground">
            <Icon class="inline mb-0.5" name="lucide:calendar" /> Programación
          </h2>
          <p class="mt-1 text-lg">
            <span class="text-base text-muted-foreground">
              <Icon class="inline mb-0.5" name="lucide:clock-arrow-up" />
              Inicio:
            </span>
            {{ formatDate(activity?.initScheduledDate) }}<br />
            <span class="text-base text-muted-foreground">
              <Icon class="inline mb-0.5" name="lucide:clock-arrow-down" /> Fin:
            </span>
            {{ formatDate(activity?.endScheduledDate) }}
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            <Icon class="inline mb-0.5" name="lucide:door-open" /> Salón
          </h2>
          <p class="mt-1 text-lg">{{ activity?.classroom?.name }}</p>
        </div>

        <div v-if="activity?.classroom?.moduleUni">
          <h2 class="font-semibold text-sm text-muted-foreground">
            <Icon class="inline mb-0.5" name="lucide:building" /> Módulo
          </h2>
          <p class="mt-1 text-lg">{{ activity?.classroom?.moduleUni?.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Button from "~/components/ui/button/Button.vue";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import type { Activity } from "~/lib/api/conferencias";
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  import Badge from "~/components/ui/badge/Badge.vue";
  import DeleteItemDialog from "~/components/partials/DeleteItemDialog.vue";

  const route = useRoute();
  const {
    data: activity,
    error,
    status,
  } = await useAsyncData<Activity>(() =>
    $api(`/activities/${route.params.id}`),
  );

  definePageMeta({
    layout: "admin",
    title: "Detalles de Actividad",
  });

  function formatDate(dateString?: string): string {
    return dateString
      ? format(new Date(dateString), "HH:mm 'del' EEEE dd 'de' MMMM yyyy", {
          locale: es,
        })
      : "Fecha no disponible";
  }
</script>
