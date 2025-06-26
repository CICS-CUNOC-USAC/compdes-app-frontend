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
      <h1 class="text-2xl font-bold">Listado de Módulos</h1>

      <div class="space-x-2 space-y-2">
        <Button size="icon" variant="outline" @click="refreshModules">
          <Icon name="lucide:refresh-ccw" />
        </Button>
        <Button size="sm" as-child>
          <NuxtLink to="/admin/modules/new">
            <Icon name="lucide:plus" />
            Crear Módulo
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

    <LoaderIndicator v-if="status == 'pending' && !modulesResponse" />

    <!-- {{ modulesResponse }} -->

    <div class=" mx-auto rounded-lg relative" v-if="modulesResponse">
      <DataTable
        :columns
        :data="modulesResponse?.content"
        :totalElements="modulesResponse?.totalElements"
        :totalPages="modulesResponse?.totalPages"
        :paginationState="paginationOptions"
        :enableSorting="false"
        @pagination-change="
          ($event: Updater<PaginationState>) => {
            if (typeof $event === 'function') {
              paginationOptions = $event(paginationOptions);
            } else {
              paginationOptions = {
                ...paginationOptions,
                ...$event,
              };
            }
          }
        "
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
  import { Button, Icon, NuxtLink } from "#components";
  import type {
    ColumnDef,
    PaginationState,
    Updater,
  } from "@tanstack/vue-table";
  import DataTable from "~/components/module/inscriptions/DataTable.vue";
  import ConfirmActionDialog from "~/components/partials/ConfirmActionDialog.vue";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import type {
    InscriptionsResponse,
    Participant,
  } from "~/lib/api/participants";
  const route = useRoute();

  const {
    data: modulesResponse,
    status,
    error,
    refresh: refreshModules,
  } = await useAsyncData<InscriptionsResponse>(
    () =>
      $api("/modules/all", {
        query: {
          page: route.query.page ? Number(route.query.page) : 0,
          size: route.query.size ? Number(route.query.size) : 10,
          // ...route.query, // All filters from the query
        },
      }),
    {
      lazy: true,
      watch: [() => route.query],
    },
  );

  const paginationOptions = computed({
    get: () => ({
      pageIndex: route.query.page ? Number(route.query.page) : 0,
      pageSize: route.query.size ? Number(route.query.size) : 10,
    }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex,
          size: value.pageSize,
        },
      });
    },
  });

  // const sortingOptions = computed({
  //   get: () => {
  //     const sortQuery = route.query.sort as string | undefined;
  //     // we'll alow only one sort at a time
  //     if (!sortQuery) return [];

  //     const [id, order] = sortQuery.split(",");

  //     return [
  //       {
  //         id,
  //         desc: order === "desc",
  //       },
  //     ];
  //   },
  //   set: (val) => {
  //     navigateTo({
  //       query: {
  //         ...route.query,
  //         sort:
  //           val.map((s) => `${s.id},${s.desc ? "desc" : "asc"}`).join(",") ||
  //           undefined,
  //       },
  //     });
  //   },
  // });

  const columns: ColumnDef<Participant>[] = [
    // {
    //   id: "actions",
    //   header: () => (
    //     <div class="text-center font-semibold">
    //       <Icon name="lucide:mouse-pointer-click" class="inline mr-1 mb-0.5" />
    //       Acciones
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <div class="flex gap-2 justify-center">
    //       <Button asChild size="icon" class="size-8" variant="outline">
    //         <NuxtLink to={`/admin/inscriptions/${row.original.id}`}>
    //           <Icon name="lucide:eye" />
    //         </NuxtLink>
    //       </Button>
    //       <ConfirmActionDialog
    //         // @ts-expect-error
    //         onConfirm={() => approveInscription(row.original.id)}
    //         description="¿Estás segur@ de que deseas aprobar esta inscripción?"
    //         title="Aprobar Inscripción"
    //       >
    //         <Button size="icon" class="size-8" variant="default">
    //           <Icon name="lucide:clipboard-check" />
    //         </Button>
    //       </ConfirmActionDialog>
    //     </div>
    //   ),
    // },
    {
      accessorKey: "name",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:school" class="inline mr-1 mb-0.5" />
          Nombre
        </div>
      ),
      cell: ({ row }) => <div class="text-base">{row.getValue("name")}</div>,
    },
  ];

  definePageMeta({
    title: "Listado de Módulos",
    layout: "admin",
  });
</script>
