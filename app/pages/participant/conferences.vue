<template>
  <div class="max-w-5xl mx-auto p-4 sm:px-50">
    <section class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Conferencias disponibles</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card v-for="presentation in presentations" :key="presentation.id"
          class="bg-gradient-to-b from-transparent to-primary/40 hover:via-primary/10 via-primary/5 transition duration-200 dark:from-primary/20 dark:to-transparent dark:hover:via-primary/10 dark:via-primary/5">
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Icon name="lucide:mic" />
              {{ presentation.name }}
            </CardTitle>
            <CardDescription>
              {{ presentation.description }}
            </CardDescription>
          </CardHeader>
          <CardContent class="text-sm text-muted-foreground">
            <p><strong>Fecha:</strong> {{ formatDate(presentation.initScheduledDate) }} - {{
              formatDate(presentation.endScheduledDate) }}</p>
            <p><strong>Salon:</strong> {{ presentation.classroom.name }}</p>
            <p v-if="presentation.classroom.moduleUni">
              <strong>Módulo:</strong> {{ presentation.classroom.moduleUni?.name }}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
    <section class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Talleres disponibles</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card v-for="workshop in workshops" :key="workshop.id"
          class="bg-gradient-to-b from-transparent to-primary/40 hover:via-primary/10 via-primary/5 transition duration-200 dark:from-primary/20 dark:to-transparent dark:hover:via-primary/10 dark:via-primary/5">
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Icon name="lucide:mic" />
              {{ workshop.name }}
            </CardTitle>
            <CardDescription>
              {{ workshop.description }}
            </CardDescription>
          </CardHeader>
          <CardContent class="text-sm text-muted-foreground">
            <p><strong>Fecha:</strong> {{ formatDate(workshop.initScheduledDate) }} - {{
              formatDate(workshop.endScheduledDate) }}</p>
            <p><strong>Salon:</strong> {{ workshop.classroom.name }}</p>
            <p v-if="workshop.classroom.moduleUni">
              <strong>Módulo:</strong> {{ workshop.classroom.moduleUni?.name }}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>

</template>



<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getConferences, type Activity } from '~/lib/api/conferencias';

const {
  data: activities,
  status,
  error,
  refresh: refreshModules,
} = await useAsyncData<Activity[]>("conferences", () => getConferences(), {
  lazy: true,
});

const presentations = computed(() =>
  activities.value?.filter((a) => a.type === 'PRESENTATION')
);

const workshops = computed(() =>
  activities.value?.filter((a) => a.type === 'WORKSHOP')
);

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-GT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
