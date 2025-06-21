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
      <h1 class="text-2xl font-bold">Listado de Inscripciones</h1>

      <div class="space-x-2 space-y-2">
        <Button size="icon" variant="outline" @click="refreshInscriptions">
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

    <div v-if="status == 'error'" class="p-4 text-center text-red-600">
      Error: {{ JSON.stringify(error, null, 2) }}
    </div>

    <InscriptionsFilters class="mb-6" :loading="status === 'pending'" />

    <LoaderIndicator v-if="status == 'pending'" />

    <div
      class="max-w-6xl mx-auto rounded-lg"
      v-if="status === 'success' && participantesResponse"
    >
      <DataTable
        :columns="columns"
        :data="participantesResponse?.content ?? []"
        :totalElements="participantesResponse?.totalElements"
        :totalPages="participantesResponse?.totalPages"
        :paginationState="paginationOptions"
        @pagination-change="
          ($event) => {
            if (typeof $event === 'function') {
              paginationOptions = $event(paginationOptions);
              console.log($event(paginationOptions));
            } else {
              paginationOptions = {
                ...paginationOptions,
                ...$event,
              };
              console.log($event);
            }
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
  import { toast } from "vue-sonner";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import { approveInscriptionByAdmin } from "~/lib/api/admin/inscriptions";
  import type {
    InscriptionsResponse,
    Participant,
  } from "~/lib/api/participants";
  import { FetchError } from "ofetch";
  import DataTable from "~/components/module/inscriptions/DataTable.vue";
  import type { ColumnDef } from "@tanstack/vue-table";
  import { Button, Icon, NuxtLink, Tooltip } from "#components";
  import {
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
  } from "~/components/ui/tooltip";
  import Badge from "~/components/ui/badge/Badge.vue";
  import ConfirmActionDialog from "~/components/partials/ConfirmActionDialog.vue";
  import InscriptionsFilters from "~/components/module/inscriptions/InscriptionsFilters.vue";
  const route = useRoute();

  const {
    data: participantesResponse,
    status,
    error,
    refresh: refreshInscriptions,
  } = await useAsyncData<InscriptionsResponse>(
    () =>
      $api("/participants/all", {
        query: {
          page: route.query.page ? Number(route.query.page) : 0,
          size: route.query.size ? Number(route.query.size) : 10,
          ...route.query, // All filters from the query
        },
      }),
    {
      lazy: true,
      watch: [() => route.query],
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

  const paginationOptions = computed({
    get: () => ({
      pageIndex: route.query.page ? Number(route.query.page) : 0,
      pageSize: route.query.size ? Number(route.query.size) : 10,
    }),
    set: (value) => {
      console.log("Pagination options updated:", value);
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex,
          size: value.pageSize,
        },
      });
    },
  });

  const columns: ColumnDef<Participant>[] = [
    {
      id: "actions",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:mouse-pointer-click" class="inline mr-1 mb-0.5" />
          Acciones
        </div>
      ),
      cell: ({ row }) => (
        <div class="flex gap-2 justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <NuxtLink to={`/admin/inscriptions/${row.original.id}`}>
                    <Icon name="lucide:eye" />
                  </NuxtLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Ver Inscripción</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ConfirmActionDialog
            // @ts-expect-error
            onConfirm={() => approveInscription(row.original.id)}
            description="¿Estás segur@ de que deseas aprobar esta inscripción?"
            title="Aprobar Inscripción"
          >
            <Button size="icon" variant="default">
              <Icon name="lucide:clipboard-check" />
            </Button>
          </ConfirmActionDialog>
        </div>
      ),
    },
    {
      accessorKey: "firstName",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 mb-0.5" />
          Nombres
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("firstName")}</div>
      ),
    },
    {
      accessorKey: "lastName",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 mb-0.5" />
          Apellidos
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("lastName")}</div>
      ),
    },
    {
      accessorKey: "organisation",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:school" class="inline mr-1 mb-0.5" />
          Universidad
        </div>
      ),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div class="cursor-pointer max-w-xs truncate">
                {row.getValue("organisation") || "Sin Universidad"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span class="">{row.getValue("organisation")}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:mail" class="inline mr-1 mb-0.5" />
          Correo Electrónico
        </div>
      ),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                class="cursor-pointer"
                onClick={() => {
                  navigator?.clipboard.writeText(row.getValue("email"));
                  toast.success("Correo electrónico copiado al portapapeles");
                }}
              >
                {row.getValue("email")}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Icon name="lucide:copy" class="inline mr-1" />
              <span>Copiar</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "phone",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:phone" class="inline mr-1 mb-0.5" />
          Teléfono
        </div>
      ),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                class="cursor-pointer"
                onClick={() => {
                  navigator?.clipboard.writeText(row.getValue("phone"));
                  toast.success("Teléfono copiado al portapapeles");
                }}
              >
                {row.getValue("phone")}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Icon name="lucide:copy" class="inline mr-1" />
              <span>Copiar</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },

    {
      accessorKey: "identificationDocument",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:id-card" class="inline mr-1 mb-0.5" />
          Identificación
        </div>
      ),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                class="cursor-pointer"
                onClick={() => {
                  navigator?.clipboard.writeText(
                    row.getValue("identificationDocument"),
                  );
                  toast.success("Identificación copiada al portapapeles");
                }}
              >
                {row.getValue("identificationDocument")}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Icon name="lucide:copy" class="inline mr-1" />
              <span>Copiar</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "isAuthor",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:pencil-line" class="inline mr-1 mb-0.5" />
          ¿Autor?
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-center">
          <Badge
            variant={row.getValue("isAuthor") ? "default" : "outline"}
            class="uppercase tracking-wider"
          >
            {row.getValue("isAuthor") ? "Sí" : "No"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "isGuest",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user-plus" class="inline mr-1 mb-0.5" />
          ¿Invitado?
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-center">
          <Badge
            variant={row.getValue("isGuest") ? "default" : "outline"}
            class="uppercase tracking-wider"
          >
            {row.getValue("isGuest") ? "Sí" : "No"}
          </Badge>
        </div>
      ),
    },
    {
      accessorFn: (row) => row.registrationStatus.isApproved,
      id: "registrationStatus",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:clipboard-list" class="inline mr-1 mb-0.5" />
          Registro
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("registrationStatus") ? "success" : "warning"}
          class="uppercase tracking-wider"
        >
          {row.getValue("registrationStatus") ? "Aprobado" : "Pendiente"}
        </Badge>
      ),
    },
    {
      accessorFn: (row) => row.registrationStatus.isCashPayment,
      id: "isCashPayment",
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:receipt" class="inline mr-1 mb-0.5" />
          Pago
        </div>
      ),
      cell: ({ row }) => (
        <>
          {row.getValue("isCashPayment")
            ? "Efectivo"
            : row.original.isCardPayment
            ? "Tarjeta"
            : "Transferencia"}
        </>
      ),
    },
  ];
</script>
