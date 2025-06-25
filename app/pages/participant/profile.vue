<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/participant">
          <Icon name="lucide:arrow-left" />
          Volver al Inicio
        </NuxtLink>
      </Button>

    <div>
      <h1 class="text-3xl font-bold mb-2">Hola, {{ profile.firstName }}</h1>
      <p class="text-muted-foreground mb-6">Aquí puedes ver los detalles de tu perfil</p>
    </div>

    <LoaderIndicator v-if="status === 'pending'" />
    <div v-else-if="error" class="text-red-600">Error al cargar los datos.</div>
    
    <div v-else class="space-y-8">
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-sm text-muted-foreground">Nombre completo</h2>
          <p class="text-lg font-medium">{{ profile.firstName }} {{ profile.lastName }}</p>
        </div>

        <div>
          <h2 class="text-sm text-muted-foreground">Correo electrónico</h2>
          <p class="text-lg">{{ profile.email }}</p>
        </div>

        <div>
          <h2 class="text-sm text-muted-foreground">Universidad</h2>
          <p class="text-lg">{{ profile.organisation }}</p>
        </div>

        <div>
          <h2 class="text-sm text-muted-foreground">Teléfono</h2>
          <p class="text-lg">{{ profile.phone }}</p>
        </div>

        <div>
          <h2 class="text-sm text-muted-foreground">DPI / Identificación</h2>
          <p class="text-lg">{{ profile.identificationDocument }}</p>
        </div>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h2 class="text-sm text-muted-foreground">¿Eres autor?</h2>
          <p :class="profile.isAuthor ? 'text-green-600' : 'text-gray-500'">
            {{ profile.isAuthor ? "Sí" : "No" }}
          </p>
        </div>

        <div>
          <h2 class="text-sm text-muted-foreground">¿Eres invitado?</h2>
          <p :class="profile.isGuest ? 'text-green-600' : 'text-gray-500'">
            {{ profile.isGuest ? "Sí" : "No" }}
          </p>
        </div>

        <div v-if="profile.qrCodeLink">
          <h2 class="text-sm text-muted-foreground">Tu código QR</h2>
          <img :src="qrCodeObjLink" alt="QR Code" class="w-40 h-40 object-contain mt-2 border rounded" />
        </div>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 class="text-sm text-muted-foreground">Método de pago</h2>
          <p class="text-lg">
            <span v-if="profile.isCardPayment">Tarjeta</span>
            <span v-else-if="profile.isTransferPayment">Transferencia</span>
            <span v-else>Efectivo</span>
          </p>
        </div>

        <div v-if="profile.cardPaymentProofLink || profile.transferPaymentProofLink">
          <h2 class="text-sm text-muted-foreground">Comprobante de pago</h2>
          <Button as-child variant="outline" size="sm" class="mt-1">
            <NuxtLink :to="profile.cardPaymentProofLink || profile.transferPaymentProofLink" target="_blank">
              <Icon name="lucide:external-link" class="mr-1" />
              Ver comprobante
            </NuxtLink>
          </Button>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
import { getMyProfile } from "~/lib/api/participants";

const imageObjUrl = ref(null);

const abortController = new AbortController();

const route = useRoute();
const {
  data: profile,
  error,
  status,
  refresh: refreshProfile,
} = await useAsyncData(() => getMyProfile(route.params.id));

useAsyncData(
  () =>
    $api(profile.value?.qrCodeLink, {
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
        if (!profile.value?.qrCodeLink) {
          abortController.abort();
        }
      },
    }),
  {
    server: false,
    lazy: true,
  },
);

const transferProofObjUrl = ref(null);

watchEffect(async () => {
  if (profile.value?.transferPaymentProofLink) {
    try {
      const res = await $api(profile.value.transferPaymentProofLink, {
        responseType: 'blob',
      });
      transferProofObjUrl.value = URL.createObjectURL(res);
    } catch (e) {
      console.error('Error fetching transfer proof image', e);
    }
  }
});

const qrCodeObjLink = ref(null);

watchEffect(async () => {
  if (profile.value?.qrCodeLink) {
    try {
      const res = await $api(profile.value.qrCodeLink, {
        responseType: 'blob',
      });
      qrCodeObjLink.value = URL.createObjectURL(res);
    } catch (e) {
      console.error('Error fetching QR image', e);
    }
  }
});

definePageMeta({
  title: "Detalles del Participante",
  layout: "participant",
})
</script>
