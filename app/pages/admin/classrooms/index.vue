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

    <div
      class="flex justify-between flex-col lg:flex-row lg:items-center gap-3 mb-6"
    >
      <h1 class="text-2xl font-bold">Listado de Salones</h1>

      <div class="space-x-2 space-y-2">
        <Button size="icon" variant="outline" @click="refreshClassrooms">
          <Icon name="lucide:refresh-ccw" />
        </Button>
        <Button size="sm" as-child>
          <NuxtLink to="/admin/classrooms/new">
            <Icon name="lucide:plus" />
            Crear Salón
          </NuxtLink>
        </Button>
      </div>
    </div>

    <div
      v-if="status == 'error'"
      class="p-4 text-center text-sm text-destructive-foreground"
    >
      <strong>No se ha podido obtener la información:</strong>
      {{ error?.data?.message || error?.message || "Error inesperado" }}
      <br />
      <span> Intenta nuevamente, limpia los filtros o recarga la página. </span>
    </div>

    <LoaderIndicator v-if="status == 'pending' && !classroomsResponse" />

    <!-- {{ classroomsResponse }} -->

    <div class="mx-auto rounded-lg relative" v-if="classroomsResponse">
      <DataTable :columns :data="classroomsResponse" :enableSorting="false" disablePagination />
      <div
        class="absolute inset-0 bg-background/40 flex items-center justify-center"
        v-if="status === 'pending'"
      >
        <LoaderIndicator />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
  import { Button, Icon, NuxtLink } from "#components";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTable from "~/components/module/inscriptions/DataTable.vue";
import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
import type { Classroom } from "~/lib/api/admin/classrooms";
  const route = useRoute();

  const {
    data: classroomsResponse,
    status,
    error,
    refresh: refreshClassrooms,
  } = await useAsyncData<Classroom[]>(
    () =>
      $api("/classrooms/all"),
    {
      lazy: true,
    },
  );

  const columns: ColumnDef<Classroom>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:presentation" class="inline mr-1 mb-0.5" />
          Nombre
        </div>
      ),
      cell: ({ row }) => <div class="text-base">{row.getValue("name")}</div>,
    },
    {
      id: "moduleUni",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:school" class="inline mr-1 mb-0.5" />
          Módulo
        </div>
      ),
      cell: ({ row }) => {
        const module = row.original.moduleUni;
        return (
          <div class="text-base">
            {module ? module.name : "Sin módulo asignado"}
          </div>
        );
      },
    }
  ];

  definePageMeta({
    title: "Listado de Salones",
    layout: "admin",
  });
</script>
