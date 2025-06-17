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

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Listado de Inscripciones</h1>

      <Button size="sm" as-child>
        <NuxtLink to="/admin/inscriptions/new">
          <Icon name="lucide:plus" />
          Crear Inscripción
        </NuxtLink>
      </Button>
    </div>

    <LoaderIndicator v-if="status == 'pending'" />
    <div v-else-if="status == 'error'" class="p-4 text-center text-red-600">
      Error: {{ error?.message }}
    </div>
    <Table
      class=""
      v-else
      container-class="max-w-5xl mx-auto border rounded-lg pb-2.5"
    >
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
        <TableRow
          v-for="p in participantesResponse?.content"
          :key="p.id"
          class="hover:bg-gray-100"
        >
          <TableCell class="text-center">
            <Button as-child size="sm" variant="outline">
              <NuxtLink :to="`/admin/inscriptions/${p.id}`">
                <Icon name="lucide:external-link" /> Ver
              </NuxtLink>
            </Button>
          </TableCell>
          <TableCell>{{ p.firstName }} {{ p.lastName }}</TableCell>
          <TableCell>{{ p.email }}</TableCell>
          <TableCell>{{ p.phone }}</TableCell>
          <TableCell class="max-w-sm truncate">{{ p.organisation }}</TableCell>
          <TableCell>{{ p.identificationDocument }}</TableCell>
          <TableCell>{{ p.isAuthor ? "Sí" : "No" }}</TableCell>
          <TableCell>{{ p.isGuest ? "Sí" : "No" }}</TableCell>
          <TableCell>
            {{ p.registrationStatus?.isApproved ? "Aprobada" : "Pendiente" }}
          </TableCell>
          <TableCell>
            {{ p.registrationStatus?.isCashPayment ? "Efectivo" : "Tarjeta" }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import type { InscriptionsResponse } from "~/lib/api/participants";

  const {
    data: participantesResponse,
    status,
    error,
    // NOTE: Temporarily changing type to match old API response structure, type should be updated later to InscriptionsResponse
  } = await useAsyncData<InscriptionsResponse>(
    () => $api("/participants/all"),
    {
      lazy: true,
    },
  );
</script>
