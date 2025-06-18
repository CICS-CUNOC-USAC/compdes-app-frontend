<template>
  <div class="container mx-auto p-5">
    <div class="">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/inscriptions">
          <Icon name="lucide:arrow-left" />
          Volver a Inscripciones
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:house" />
          Volver a Inicio
        </NuxtLink>
      </Button>

      <h1 class="text-2xl font-bold">Detalles de Inscripción</h1>
    </div>

    <div v-if="error" class="text-red-600">Failed to load inscription.</div>

    <!-- <div v-else-if="!inscription" class="text-muted-foreground">Cargando</div> -->
    <LoaderIndicator v-if="status === 'pending'" />

    <div v-else class="mt-3">
      <h2 class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4">
        Acciones:
      </h2>
      <div class="mb-3 space-x-2 space-y-2">
        <DeleteItemDialog @confirm="deleteInscription">
          <Button
            size="sm"
            variant="destructive"
            :disabled="inscription.registrationStatus.isApproved"
            :loading="asyncStatus === 'pending'"
          >
            <Icon name="lucide:trash" />
            Eliminar Inscripción
          </Button>
        </DeleteItemDialog>
        <ConfirmActionDialog
          @confirm="approveInscription"
          description="¿Estás segur@ de que deseas aprobar esta inscripción?"
          title="Aprobar Inscripción"
        >
          <Button size="sm" variant="outline" :disabled="inscription.registrationStatus.isApproved">
            <Icon name="lucide:clipboard-check" />
            Aprobar Inscripción
          </Button>
        </ConfirmActionDialog>
      </div>

      <h2 class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4">
        Información:
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">Nombre</h2>
          <p class="mt-1 text-lg">
            {{ inscription.firstName }} {{ inscription.lastName }}
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            Universidad
          </h2>
          <p class="mt-1 text-lg">{{ inscription.organisation }}</p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            Correo electrónico
          </h2>
          <p class="mt-1 text-lg">{{ inscription.email }}</p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">Teléfono</h2>
          <p class="mt-1 text-lg">{{ inscription.phone }}</p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            Documento de Identificación
          </h2>
          <p class="mt-1 text-lg">{{ inscription.identificationDocument }}</p>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            ¿Es autor?
          </h2>
          <p
            class="mt-1 font-medium"
            :class="
              inscription.isAuthor
                ? 'text-green-600 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400'
            "
          >
            {{ inscription.isAuthor ? "Si" : "No" }}
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            ¿Es invitado?
          </h2>
          <p
            class="mt-1 font-medium"
            :class="
              inscription.isGuest
                ? 'text-green-600 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400'
            "
          >
            {{ inscription.isGuest ? "Si" : "No" }}
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">Estado</h2>
          <span
            class="mt-1 inline-block px-3 py-1 rounded-full text-sm"
            :class="
              inscription.registrationStatus.isApproved
                ? 'text-green-800 dark:text-green-900 bg-green-100 dark:bg-green-200'
                : 'text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200'
            "
          >
            {{
              inscription.registrationStatus.isApproved
                ? "Aprobado"
                : "Pendiente"
            }}
          </span>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground">
            Método de pago
          </h2>
          <p class="mt-1 text-lg">
            <span v-if="inscription.isCardPayment">Tarjeta</span>
            <span v-else-if="inscription.isTransferPayment">Transferencia</span>
            <span v-else>Cash</span>
          </p>
        </div>

        <div v-if="inscription.cardPaymentProofLink" class="mt-4">
          <h3 class="font-semibold text-sm text-muted-foreground">
            Comprobante de pago (Tarjeta)
          </h3>
          <Button as-child variant="outline" size="sm" class="mt-1">
            <NuxtLink :to="inscription.cardPaymentProofLink" target="_blank">
              <Icon name="lucide:external-link" />
              Ver comprobante
            </NuxtLink>
          </Button>
        </div>

        <div v-if="inscription.registrationStatus.voucherNumber" class="mt-4">
          <h3 class="font-semibold text-sm text-muted-foreground">
            Identificador de pago (Talonario) #
          </h3>
          <p class="mt-1 text-lg">
            {{ inscription.registrationStatus.voucherNumber }}
          </p>
        </div>
      </div>
    </div>
    <div>
      <img
        v-if="imageObjUrl"
        :src="imageObjUrl"
        alt="QR Code"
        class="mt-4 w-48 h-48 object-cover"
      />
    </div>
  </div>
</template>
<script setup>
  import { toast } from "vue-sonner";
import ConfirmActionDialog from "~/components/partials/ConfirmActionDialog.vue";
  import DeleteItemDialog from "~/components/partials/DeleteItemDialog.vue";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import {
    approveInscriptionByAdmin,
    deleteInscriptionByAdmin,
    getInscriptionByAdmin,
  } from "~/lib/api/admin/inscriptions";

  const imageObjUrl = ref(null);

  const abortController = new AbortController();

  const route = useRoute();
  const {
    data: inscription,
    error,
    status,
    refresh: refreshInscription,
  } = await useAsyncData(() => getInscriptionByAdmin(route.params.id));

  useAsyncData(
    () =>
      $api(inscription.value?.qrCodeLink, {
        signal: abortController.signal,
        onResponse: ({ response }) => {
          if (response.status === 200) {
            const blob = new Blob([response._data], { type: "image/png" });
            imageObjUrl.value = URL.createObjectURL(blob);
            return imageObjUrl.value;
          } else {
            throw new Error("Failed to fetch QR code");
          }
        },
        onRequest: () => {
          if (!inscription.value?.qrCodeLink) {
            abortController.abort();
          }
        },
      }),
    {
      server: false,
      lazy: true,
    },
  );

  const { mutate: deleteInscription, asyncStatus } = useMutation({
    mutation: () => deleteInscriptionByAdmin(route.params.id),
    onSuccess: () => {
      toast.success("Inscripción eliminada correctamente");
      navigateTo("/admin/inscriptions");
    },
  });

  const { mutate: approveInscription } = useMutation({
    mutation: () => approveInscriptionByAdmin(route.params.id),
    onSuccess: () => {
      toast.success("Inscripción aprobada correctamente");
      refreshInscription();
    },
    onError: (error) => {
      toast.error(
        `Error al aprobar inscripción: ${error.data?.message || error.message}`,
      );
    },
  });
</script>
