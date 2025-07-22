<template>
  <div class="max-w-5xl mx-auto p-4 sm:px-50">
    <Card
      class="bg-gradient-to-b from-transparent to-primary/40 hover:via-primary/10 via-primary/5 transition duration-200 dark:from-primary/20 dark:to-transparent dark:hover:via-primary/10 dark:via-primary/5">
      <CardHeader>
        <CardTitle class="text-xl flex items-center gap-2">
          Horarios
        </CardTitle>
        <CardDescription>
          Aqui puedes encontrar todos los horarios de ponencias y talleres.
          Recuerda asignarte a los talleres que quieras asistir, son limitados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h2 class="mb-2 font-semibold">Importante</h2>
        <p>En el siguiente link puedes encontrar tambien el cronograma por dia de las ponencias y talleres. <a
            class="underline text-red-700"
            href="https://docs.google.com/spreadsheets/d/1NTDuaOdQ1z2jy0tvp8vRCOIBJpbTS-o0fKV_nPJvtz4">Link de
            Sheets</a></p>

      </CardContent>
    </Card>
    <Tabs default-value="conferencias" class="w-full">
      <TabsList class="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="conferencias">Conferencias</TabsTrigger>
        <TabsTrigger value="talleres">Talleres</TabsTrigger>
      </TabsList>

      <TabsContent value="conferencias">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card v-for="presentation in presentations" :key="presentation.id"
            class="bg-gradient-to-b from-transparent to-primary/40 hover:via-primary/10 via-primary/5 transition duration-200 dark:from-primary/20 dark:to-transparent dark:hover:via-primary/10 dark:via-primary/5">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Icon name="lucide:mic" />
                {{ presentation.name }}
              </CardTitle>
              <CardDescription>{{ presentation.description }}</CardDescription>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
              <p><strong>Fecha:</strong> {{ formatDate(presentation.initScheduledDate) }} - {{
                formatDate(presentation.endScheduledDate) }}</p>
              <p><strong>Salón:</strong> {{ presentation.classroom.name }}</p>
              <p v-if="presentation.classroom.moduleUni">
                <strong>Módulo:</strong> {{ presentation.classroom.moduleUni?.name }}
              </p>
            </CardContent>
            <CardFooter
              class="flex gap-2 flex-col items-start px-6 text-muted-foreground group-hover:text-accent-foreground transition duration-200">
              <div class="space-x-2">
                <Button as-child size="sm" variant="secondary">
                  <NuxtLink :to="`/participant/conferences/${presentation.id}`">
                    <Icon name="lucide:eye" />
                    Ver
                  </NuxtLink>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="talleres">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card v-for="workshop in workshops" :key="workshop.id"
            class="bg-gradient-to-b from-transparent to-primary/40 hover:via-primary/10 via-primary/5 transition duration-200 dark:from-primary/20 dark:to-transparent dark:hover:via-primary/10 dark:via-primary/5">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Icon name="lucide:mic" />
                {{ workshop.name }}
              </CardTitle>
              <CardDescription>{{ workshop.description }}</CardDescription>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
              <p><strong>Fecha:</strong> {{ formatDate(workshop.initScheduledDate) }} - {{
                formatDate(workshop.endScheduledDate) }}</p>
              <p><strong>Salón:</strong> {{ workshop.classroom.name }}</p>
              <p v-if="workshop.classroom.moduleUni">
                <strong>Módulo:</strong> {{ workshop.classroom.moduleUni?.name }}
              </p>
            </CardContent>
            <!--
            <CardFooter
              class="flex gap-2 flex-col items-start px-6 text-muted-foreground group-hover:text-accent-foreground transition duration-200">
              <div class="space-x-2">
                <Button as-child size="sm" variant="secondary">
                  <NuxtLink :to="`/participant/conferences/${workshop.id}`">
                    <Icon name="lucide:eye" />
                    Ver
                  </NuxtLink>
                </Button>
              </div>
            </CardFooter>
            -->
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>

</template>



<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getConferences, type Activity } from '~/lib/api/conferencias';
import CardFooter from '~/components/ui/card/CardFooter.vue';

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
