<template>
  <div class="max-w-5xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Listado de Inscripciones</h1>
      <Button to="/">Crear Inscripción</Button>
    </div>

    <div v-if="status == 'pending'" class="p-4 text-center">⏳ Cargando...</div>
    <div v-else-if="status == 'error'" class="p-4 text-center text-red-600">
      Error: {{ error?.message }}
    </div>
    <div v-else>
      <Table class="border rounded-md overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead class="whitespace-nowrap">Organización</TableHead>
            <TableHead>ID Documento</TableHead>
            <TableHead>Autor?</TableHead>
            <TableHead>Invitado?</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead class="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="p in participantes" :key="p.id" class="hover:bg-gray-100">
            <TableCell>{{ p.firstName }} {{ p.lastName }}</TableCell>
            <TableCell>{{ p.email }}</TableCell>
            <TableCell>{{ p.phone }}</TableCell>
            <TableCell class="whitespace-nowrap">{{ p.organisation }}</TableCell>
            <TableCell>{{ p.identificationDocument }}</TableCell>
            <TableCell>{{ p.isAuthor ? 'Sí' : 'No' }}</TableCell>
            <TableCell>{{ p.isGuest ? 'Sí' : 'No' }}</TableCell>
            <TableCell>
              {{ p.registrationStatus.isApproved ? 'Aprobada' : 'Pendiente' }}
            </TableCell>
            <TableCell>
              {{ p.registrationStatus.isCashPayment ? 'Efectivo' : 'Tarjeta' }}
            </TableCell>
            <TableCell class="text-center">
              <NuxtLink :to="`/admin/inscriptions/${p.id}`">
                <Button>Ver</Button>
              </NuxtLink>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Participant } from '~/lib/api/participants'

const { data: participantes, status, error } = await useAsyncData<Participant[]>(() => $api('/participants/all'))
</script>
