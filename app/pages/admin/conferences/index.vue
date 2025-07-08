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
      <h1 class="text-2xl font-bold">Listado de Conferencias</h1>

      <div class="space-x-2 space-y-2">
        <Button size="icon" variant="outline" @click="refreshModules">
          <Icon name="lucide:refresh-ccw" />
        </Button>
        <Button size="sm" as-child>
          <NuxtLink to="/admin/conferences/new">
            <Icon name="lucide:plus" />
            Crear Conferencia
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

    <LoaderIndicator v-if="status == 'pending' && !conferences" />

    <div class="mx-auto rounded-lg relative" v-if="conferences">
      <DataTable
        :columns
        :data="conferences"
        :enableSorting="false"
        disable-pagination
        table-key-name="conferences_table"
      />
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
  import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenu,
  } from "~/components/ui/dropdown-menu";
  import { Button } from "~/components/ui/button";
  import { Icon, NuxtLink } from "#components";
  import type { ColumnDef } from "@tanstack/vue-table";
  import DataTable from "~/components/module/inscriptions/DataTable.vue";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import type { Activity } from "~/lib/api/conferencias";
  import { getConferences } from "~/lib/api/conferencias";
  import Tooltip from "~/components/ui/tooltip/Tooltip.vue";
  import TooltipProvider from "~/components/ui/tooltip/TooltipProvider.vue";
  import TooltipTrigger from "~/components/ui/tooltip/TooltipTrigger.vue";
  import TooltipContent from "~/components/ui/tooltip/TooltipContent.vue";

  const {
    data: conferences,
    status,
    error,
    refresh: refreshModules,
  } = await useAsyncData<Activity[]>("conferences", () => getConferences(), {
    lazy: true,
  });

  const columns: ColumnDef<Activity>[] = [
    {
      id: "actions",
      header: () => (
        <div class="flex justify-center w-full items-center font-semibold">
          <Icon name="lucide:settings" class="inline mr-1 mb-0.5" />
          Acciones
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div class="flex justify-center [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none">
            <Button asChild size="icon" class="size-9" variant="default">
              <NuxtLink to={`/admin/conferences/${row.original.id}`}>
                <Icon name="lucide:eye" />
              </NuxtLink>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" class="size-9" variant="outline">
                    <NuxtLink
                      to={`/admin/conferences/${row.original.id}/attendance`}
                    >
                      <Icon name="lucide:qr-code" />
                    </NuxtLink>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Registrar asistencia</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" class="size-9" size="icon">
                  <Icon name="lucide:ellipsis" class="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Otras Acciones</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <NuxtLink to={`/admin/conferences/${row.original.id}/edit`}>
                    <Icon
                      name="lucide:pencil"
                      class="inline mr-1 text-muted-foreground"
                    />
                    Editar Actividad
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:text" class="inline mr-1 mb-0.5" />
          Nombre
        </div>
      ),
      cell: ({ row }) => <div class="text-base">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:info" class="inline mr-1 mb-0.5" />
          Descripción
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:shapes" class="inline mr-1 mb-0.5" />
          Tipo
        </div>
      ),
      cell: ({ row }) => <div class="text-base">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "initScheduledDate",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:clock-arrow-up" class="inline mr-1 mb-0.5" />
          Inicio Programado
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">
          {new Date(row.getValue("initScheduledDate")).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "endScheduledDate",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:clock-arrow-down" class="inline mr-1 mb-0.5" />
          Fin Programado
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">
          {new Date(row.getValue("endScheduledDate")).toLocaleString()}
        </div>
      ),
    },
    {
      id: "classroomName",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:presentation" class="inline mr-1 mb-0.5" />
          Salón
        </div>
      ),
      accessorFn: (row) => row.classroom?.name ?? "No asignado",
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("classroomName")}</div>
      ),
    },
    {
      id: "moduleUniName",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:building" class="inline mr-1 mb-0.5" />
          Modulo
        </div>
      ),
      accessorFn: (row) => row.classroom?.moduleUni?.name || "-",
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("moduleUniName")}</div>
      ),
    },
  ];

  definePageMeta({
    title: "Listado de Conferencias",
    layout: "admin",
  });
</script>
