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
        <Button size="sm" @click="exportarPonentes" variant="outline">
          <Icon name="lucide:file-output" />
          Exportar ponentes
        </Button>
        <Button size="sm" @click="exportarParticipantes" variant="outline">
          <Icon name="lucide:file-output" />
          Exportar participantes
        </Button>
        <Button size="sm" @click="exportarCorreos" variant="outline">
          <Icon name="lucide:file-output" />
          Exportar correos
        </Button>
        <Button size="sm" as-child>
          <NuxtLink to="/admin/inscriptions/new">
            <Icon name="lucide:plus" />
            Crear Inscripción
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

    <InscriptionsFilters class="mb-6" :loading="status === 'pending'" />

    <LoaderIndicator v-if="status == 'pending' && !participantesResponse" />

    <div
      class="max-w-6xl mx-auto rounded-lg relative"
      v-if="participantesResponse"
    >
      <DataTable
        :columns
        :data="participantesResponse?.content"
        :totalElements="participantesResponse?.totalElements"
        :totalPages="participantesResponse?.totalPages"
        :paginationState="paginationOptions"
        :sorting="sortingOptions"
        table-key-name="inscriptions-table"
        @sort-change="
          ($event) => {
            const newSorting =
              typeof $event === 'function' ? $event(sortingOptions) : $event;
            sortingOptions = newSorting;
          }
        "
        @pagination-change="
          ($event) => {
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
      <!-- overlay: -->
      <Transition name="fade-overlay" mode="out-in">
        <div
          class="absolute inset-0 bg-background/40 flex items-center justify-center"
          v-if="status === 'pending'"
        >
          <LoaderIndicator />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="tsx">
  import { Button, Icon, NuxtLink, Tooltip } from "#components";
  import type { ColumnDef } from "@tanstack/vue-table";
  import { FetchError } from "ofetch";
  import { toast } from "vue-sonner";
  import DataTable from "~/components/module/inscriptions/DataTable.vue";
  import InscriptionsFilters from "~/components/module/inscriptions/InscriptionsFilters.vue";
  import ConfirmActionDialog from "~/components/partials/ConfirmActionDialog.vue";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import Badge from "~/components/ui/badge/Badge.vue";
  import DropdownMenu from "~/components/ui/dropdown-menu/DropdownMenu.vue";
  import DropdownMenuContent from "~/components/ui/dropdown-menu/DropdownMenuContent.vue";
  import DropdownMenuItem from "~/components/ui/dropdown-menu/DropdownMenuItem.vue";
  import DropdownMenuLabel from "~/components/ui/dropdown-menu/DropdownMenuLabel.vue";
  import DropdownMenuTrigger from "~/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
  import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "~/components/ui/tooltip";
  import { approveInscriptionByAdmin } from "~/lib/api/admin/inscriptions";
  import type { Participant } from "~/lib/api/participants";
  import type { PageableResponse } from "~/lib/api/shared";
  const route = useRoute();

  function exportarParticipantes() {
    $api<Blob>("/reports/approved-participants-by-role-email/false", {
      method: "GET",
      responseType: "blob",
    })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "correos.txt";
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        toast.error("No se pudo exportar los correos");
        console.error(err);
      });
  }

  function exportarPonentes() {
    $api<Blob>("/reports/approved-participants-by-role-email/true", {
      method: "GET",
      responseType: "blob",
    })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "correos.txt";
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        toast.error("No se pudo exportar los correos");
        console.error(err);
      });
  }

  function exportarCorreos() {
    $api<Blob>("/reports/get-approved-participants-email", {
      method: "GET",
      responseType: "blob",
    })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "correos.txt";
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        toast.error("No se pudo exportar los correos");
        console.error(err);
      });
  }

  const {
    data: participantesResponse,
    status,
    error,
    refresh: refreshInscriptions,
  } = await useAsyncData<PageableResponse<Participant>>(
    "admin-inscriptions",
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
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex,
          size: value.pageSize,
        },
      });
    },
  });

  const sortingOptions = computed({
    get: () => {
      const sortQuery = route.query.sort as string | undefined;
      // we'll alow only one sort at a time
      if (!sortQuery) return [];

      const [id, order] = sortQuery.split(",");

      return [
        {
          id,
          desc: order === "desc",
        },
      ];
    },
    set: (val) => {
      navigateTo({
        query: {
          ...route.query,
          sort:
            val.map((s) => `${s.id},${s.desc ? "desc" : "asc"}`).join(",") ||
            undefined,
        },
      });
    },
  });

  const columns: ColumnDef<Participant>[] = [
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:mouse-pointer-click" class="inline mr-1 mb-0.5" />
          Acciones
        </div>
      ),
      cell: ({ row }) => (
        <div class="flex justify-center [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none">
          <Button asChild size="icon" class="size-9" variant="default">
            <NuxtLink to={`/admin/inscriptions/${row.original.id}`}>
              <Icon name="lucide:eye" />
            </NuxtLink>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" class="size-9" size="icon">
                <Icon name="lucide:ellipsis" class="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Otras Acciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <NuxtLink to={`/admin/inscriptions/${row.original.id}/edit`}>
                  <Icon
                    name="lucide:pencil"
                    class="inline mr-1 text-muted-foreground"
                  />
                  Editar Inscripción
                </NuxtLink>
              </DropdownMenuItem>
              <ConfirmActionDialog
                // @ts-expect-error
                onConfirm={() => approveInscription(row.original.id)}
                description="¿Estás segur@ de que deseas aprobar esta inscripción?"
                title="Aprobar Inscripción"
              >
                <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
                  <Icon
                    name="lucide:clipboard-check"
                    class="inline mr-1 text-muted-foreground"
                  />
                  Aprobar Inscripción
                </DropdownMenuItem>
              </ConfirmActionDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      accessorKey: "firstName",
      meta: {
        displayName: "Nombres",
      },
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
      meta: {
        displayName: "Apellidos",
      },
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
      accessorKey: "createdAt",
      meta: {
        displayName: "Fecha de Inscripción",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:calendar" class="inline mr-1 mb-0.5" />
          Fecha de Inscripción
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-center">{row.getValue("createdAt")}</div>
      ),
    },
    {
      accessorKey: "organisation",
      meta: {
        displayName: "Universidad",
      },
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
      meta: {
        displayName: "Correo Electrónico",
      },
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
      meta: {
        displayName: "Teléfono",
      },
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
      meta: {
        displayName: "Identificación",
      },
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
      meta: {
        displayName: "¿Autor?",
      },
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
      meta: {
        displayName: "¿Invitado?",
      },
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
      meta: {
        displayName: "Registro",
      },
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
      meta: {
        displayName: "Pago en Efectivo",
      },
      enableSorting: false,
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
    {
      accessorKey: "qrCodeNumber",
      meta: {
        displayName: "Número QR",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:qr-code" class="inline mr-1 mb-0.5" />
          Número QR
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-center">
          {row.getValue("qrCodeNumber") ? (
            <Badge variant="secondary" class="uppercase tracking-wider">
              {row.getValue("qrCodeNumber")}
            </Badge>
          ) : (
            <Badge variant="outline" class="uppercase tracking-wider">
              Sin QR
            </Badge>
          )}
        </div>
      ),
    },
  ];

  definePageMeta({
    title: "Listado de Inscripciones",
    layout: "admin",
  });
</script>
<style scoped>
  @reference '~/assets/css/main.css';

  .fade-overlay-enter-active,
  .fade-overlay-leave-active {
    @apply transition-opacity duration-300;
  }

  .fade-overlay-enter-from,
  .fade-overlay-leave-to {
    opacity: 0;
  }
</style>
