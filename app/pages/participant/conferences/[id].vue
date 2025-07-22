<template>
  <div class="container mx-auto p-5">
    <div class="">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/participant/conferences">
          <Icon name="lucide:arrow-left" />
          Volver a Actividades
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/participant">
          <Icon name="lucide:house" />
          Volver a Inicio
        </NuxtLink>
      </Button>

      <h1 class="text-2xl font-bold">Detalles de Actividad</h1>
    </div>

    <div v-if="error" class="text-red-600">Failed to load activity.</div>

    <LoaderIndicator v-if="status === 'pending'" />

    <div v-else class="mt-3">
      <h2 class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4">
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
              <Icon class="inline mb-0.5" name="lucide:clock-arrow-up" /> Inicio:
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
        <div v-if="activity?.type === 'WORKSHOP'" class="mt-8">
          <h2 class="text-sm text-muted-foreground font-semibold mb-2">
            ¿Te gustaría participar en este taller?
          </h2>

          <p class="text-sm text-muted-foreground">
            Participantes asignados: <strong>{{ countAssigneesData?.total }}</strong>
            <template v-if="participantLimit !== undefined">
              / {{ participantLimit }}
            </template>
          </p>

          <Button size="sm" variant="default" @click="assignWorkshop" :disabled="isAlreadyAssigned || isFull">
            <Icon name="lucide:plus-circle" />
            {{
              isAlreadyAssigned
                ? "Ya estás inscrito"
                : isFull
                  ? "Cupo lleno"
                  : "Unirme al taller"
            }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue';
import LoaderIndicator from '~/components/partials/LoaderIndicator.vue';
import { assignToWorkShop, countParticipants, getUserWorkshops, isAssigned, type Activity } from '~/lib/api/conferencias';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Badge from '~/components/ui/badge/Badge.vue';
import { toast } from 'vue-sonner';

const route = useRoute();
const {
  data: activity,
  error,
  status,
} = await useAsyncData<Activity>(() => $api(`/activities/${route.params.id}`));

const {
  data: userActivities,
} = await useAsyncData<Activity[]>(() => getUserWorkshops());

const isAlreadyAssigned = computed(() =>
  userActivities.value?.some(a => (a as any).activity.id == (route.params.id as string))
);

definePageMeta({
  layout: "participant",
  title: "Detalles de Actividad",
});

function formatDate(dateString?: string): string {
  return dateString
    ? format(new Date(dateString), "HH:mm 'del' EEEE dd 'de' MMMM yyyy", { locale: es })
    : 'Fecha no disponible';
}

const {
  data: countAssigneesData,
  status: countStatus,
  error: countError,
  refresh: refreshCount
} = await useAsyncData(
  `workshop-assignee-count-${route.params.id}`,
  () => countParticipants(route.params.id as string),
  {
    lazy: true,
    server: false,
    watch: [() => activity.value?.type], // se reevalúa cuando cambie el tipo
    immediate: false, // no se ejecuta hasta que manualmente se llame
  }
);

watchEffect(() => {
  if (activity.value?.type === "WORKSHOP") {
    refreshCount()
  }
});

const participantLimit = computed(() => {
  const match = activity.value?.description?.match(/L[ií]mite:\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
});

const isFull = computed(() => {
  return participantLimit.value !== undefined && (countAssigneesData.value?.total ?? 0) >= participantLimit.value;
});

const { mutate: assignWorkshop, asyncStatus } = useMutation({
  mutation: () => assignToWorkShop(activity.value?.id ?? ''),
  onSuccess: (response) => {
    const res = response as { message?: string };
    toast.success(res.message || "Taller asignado correctamente!");
  },
  onError: (error) => {
    toast.error(error?.message || "Error al asignar el taller. Intenta de nuevo mas tarde.")
  },
});
</script>
