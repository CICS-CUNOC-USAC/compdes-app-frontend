<template>
  <div class="container mx-auto p-5">
    <div class="mb-3">
      <Button as-child size="sm" variant="link">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:arrow-left" />
          Volver a Inicio
        </NuxtLink>
      </Button>
    </div>

    <div class="flex justify-between flex-col lg:flex-row lg:items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold">Listado de Inscripciones</h1>

      <div class="space-x-2 space-y-2">
        <Button
          size="icon"
          variant="outline"
          @click="refreshInscriptions"
        >
          <Icon name="lucide:refresh-ccw" />
        </Button>
        <Button size="sm" as-child>
          <NuxtLink to="/admin/inscriptions/new">
            <Icon name="lucide:plus" />
            Crear Inscripción
          </NuxtLink>
        </Button>
      </div>
    </div>

    <LoaderIndicator v-if="status == 'pending'" />
    <div v-else-if="status == 'error'" class="p-4 text-center text-red-600">
      Error: {{ error?.message }}
    </div>
    <div v-else>
      <div class="max-w-5xl mx-auto border-2 rounded-lg overflow-hidden">
        <Table container-class="pb-2.5 overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead class="text-center">Acciones</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead class="whitespace-nowrap">Organización</TableHead>
              <TableHead>ID Documento</TableHead>
              <TableHead>Autor?</TableHead>
              <TableHead>Invitado?</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
            </TableRow>
          </TableHeader>

          <!-- 
        NOTE: Changing this temporarly to use participantesResponse only with old version of API, but after fixing, should be participantsResponse?.content again
        -->
          <TableBody>
            <TableRow v-for="p in participantesResponse?.content" :key="p.id">
              <TableCell class="text-center space-x-1">
                <Button as-child size="sm" variant="outline">
                  <NuxtLink :to="`/admin/inscriptions/${p.id}`">
                    <Icon name="lucide:external-link" /> Ver
                  </NuxtLink>
                </Button>
                <ConfirmActionDialog
                  @confirm="() => approveInscription(p.id)"
                  description="¿Estás segur@ de que deseas aprobar esta inscripción?"
                  title="Aprobar Inscripción"
                >
                  <Button size="icon" variant="default">
                    <Icon name="lucide:clipboard-check" />
                  </Button>
                </ConfirmActionDialog>
              </TableCell>
              <TableCell>{{ p.firstName }} {{ p.lastName }}</TableCell>
              <TableCell>{{ p.email }}</TableCell>
              <TableCell>{{ p.phone }}</TableCell>
              <TableCell class="max-w-xs truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span class="cursor-pointer">
                        {{ p.organisation }}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span class="">{{ p.organisation }}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <!-- {{ p.organisation }} -->
              </TableCell>
              <TableCell>{{ p.identificationDocument }}</TableCell>
              <TableCell class="text-center">
                <Badge :variant="p.isAuthor ? 'default' : 'outline'">
                  {{ p.isAuthor ? "Sí" : "No" }}
                </Badge>
              </TableCell>
              <TableCell class="text-center">
                <Badge :variant="p.isGuest ? 'default' : 'outline'">
                  {{ p.isGuest ? "Sí" : "No" }}
                </Badge>
              </TableCell>
              <TableCell class="text-center">
                <Badge
                  :variant="
                    p.registrationStatus?.isApproved ? 'success' : 'warning'
                  "
                  class="capitalize"
                >
                  {{
                    p.registrationStatus?.isApproved ? "Aprobada" : "Pendiente"
                  }}
                </Badge>
              </TableCell>
              <TableCell class="pr-4">
                {{
                  p.registrationStatus?.isCashPayment
                    ? "Efectivo"
                    : p.isCardPayment
                    ? "Tarjeta"
                    : "Transferencia"
                }}
              </TableCell>
              <TableCell class="pr-4">
                {{
                  p.createdAt
                }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination goes here -->
      <div class="mt-6 flex justify-center">
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toast } from "vue-sonner";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import { approveInscriptionByAdmin } from "~/lib/api/admin/inscriptions";
  import type { InscriptionsResponse } from "~/lib/api/participants";
  import { FetchError } from "ofetch";
  import ConfirmActionDialog from "~/components/partials/ConfirmActionDialog.vue";
  import TooltipProvider from "~/components/ui/tooltip/TooltipProvider.vue";
  import Tooltip from "~/components/ui/tooltip/Tooltip.vue";
  import Badge from "~/components/ui/badge/Badge.vue";

  const {
    data: participantesResponse,
    status,
    error,
    refresh: refreshInscriptions,
    // NOTE: Temporarily changing type to match old API response structure, type should be updated later to InscriptionsResponse
  } = await useAsyncData<InscriptionsResponse>(
    () => $api("/participants/all"),
    {
      lazy: true,
    },
  );

  const { mutate: approveInscription } = useMutation({
    mutation: (id: string) => approveInscriptionByAdmin(id),
    onSuccess: () => {
      toast.success("Inscripción aprobada correctamente");
      refreshInscriptions();
    },
    onError: (error) => {
      const err = error as FetchError;
      toast.error(
        `Error al aprobar inscripción: ${err.data?.message || err.message}`,
      );
    },
  });
</script>
