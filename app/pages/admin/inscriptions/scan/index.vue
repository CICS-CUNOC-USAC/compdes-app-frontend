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

      <h1 class="text-2xl font-bold">Obtener detalles de inscripción</h1>
      <Accordion
        type="single"
        collapsible
        default-value="scanner"
        v-model="accordionScanner"
        class="mb-4"
      >
        <AccordionItem value="scanner">
          <AccordionTrigger class="border-b border-border rounded-none"
            >Éscaner - Abrir/Cerrar</AccordionTrigger
          >
          <AccordionContent>
            <div
              class="rounded-lg ring-1 ring-black/25 shadow-lg overflow-hidden aspect-square bg-white mt-2"
            >
              <QrcodeStream
                :paused="paused"
                :track="paintOutline"
                @error="onError"
                @detect="onDetect"
                @camera-on="onCameraReady"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div v-if="inscription">
        <h2
          class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4"
        >
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
            <h2 class="font-semibold text-sm text-muted-foreground">
              Teléfono
            </h2>
            <p class="mt-1 text-lg">{{ inscription.phone }}</p>
          </div>

          <div>
            <h2 class="font-semibold text-sm text-muted-foreground">
              Documento de Identificación
            </h2>
            <p class="mt-1 text-lg">{{ inscription.identificationDocument }}</p>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
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
          <div v-if="inscription.qrCodeLink">
            <h3 class="font-semibold text-sm text-muted-foreground">
              Codigo QR
            </h3>
            <img v-if="qrCodeObjLink" :src="qrCodeObjLink" alt="Codigo QR" />
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 class="font-semibold text-sm text-muted-foreground">
              Método de pago
            </h2>
            <p class="mt-1 text-lg">
              <span v-if="inscription.isCardPayment">Tarjeta</span>
              <span v-else-if="inscription.isTransferPayment"
                >Transferencia</span
              >
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

          <div v-if="inscription.transferPaymentProofLink" class="mt-4">
            <h3 class="font-semibold text-sm text-muted-foreground">
              Comprobante de pago (Transferencia)
            </h3>
            <img
              v-if="transferProofObjUrl"
              :src="transferProofObjUrl"
              alt="Comprobante de pago"
              class="w-90 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { QrcodeStream, type DetectedBarcode } from "vue-qrcode-reader";
  import { toast } from "vue-sonner";
  import { getParticipantInfoByQr } from "~/lib/api/inscriptions";
  import type { Participant } from "~/lib/api/participants";

  const accordionScanner = ref();

  const qrReaderError = ref("");
  const paused = ref(false);

  const result = ref("");

  const defaultConstraintOptions = [
    { label: "rear camera", constraints: { facingMode: "environment" } },
    { label: "front camera", constraints: { facingMode: "user" } },
  ];
  const constraintOptions = ref();

  function onDetect(detectedCodes: DetectedBarcode[]) {
    if (detectedCodes.length > 0) {
      const firstCode = detectedCodes[0];
      result.value = firstCode.rawValue;
      toast.success(`Nuevo código QR detectado`);
      accordionScanner.value = "";
    }
  }

  async function onCameraReady() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

    constraintOptions.value = [
      ...defaultConstraintOptions,
      ...videoDevices.map(({ deviceId, label }) => ({
        label: `${label} (ID: ${deviceId})`,
        constraints: { deviceId },
      })),
    ];

    qrReaderError.value = "";
  }

  function paintOutline(
    detectedCodes: DetectedBarcode[],
    ctx: CanvasRenderingContext2D,
  ) {
    for (const detectedCode of detectedCodes) {
      const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

      ctx.strokeStyle = "red";

      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (const { x, y } of otherPoints) {
        ctx.lineTo(x, y);
      }
      ctx.lineTo(firstPoint.x, firstPoint.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
  function onError(err: Error) {
    qrReaderError.value = `[${err.name}]: `;

    if (err.name === "NotAllowedError") {
      qrReaderError.value += "you need to grant camera access permission";
    } else if (err.name === "NotFoundError") {
      qrReaderError.value += "no camera on this device";
    } else if (err.name === "NotSupportedError") {
      qrReaderError.value += "secure context required (HTTPS, localhost)";
    } else if (err.name === "NotReadableError") {
      qrReaderError.value += "is the camera already in use?";
    } else if (err.name === "OverconstrainedError") {
      qrReaderError.value += "installed cameras are not suitable";
    } else if (err.name === "StreamApiNotSupportedError") {
      qrReaderError.value += "Stream API is not supported in this browser";
    } else if (err.name === "InsecureContextError") {
      qrReaderError.value +=
        "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
    } else {
      qrReaderError.value += err.message;
    }
  }

  async function clearResult() {
    result.value = "";
    paused.value = true;
    await timeout(50); // Pauses for 200 milliseconds before resuming
    paused.value = false;
  }

  const { data: inscription } = useAsyncData<Participant>(
    () => getParticipantInfoByQr(result.value),
    {
      immediate: false,
      server: false,
      watch: [result],
    },
  );

  const imageObjUrl = ref();
  const transferProofObjUrl = ref()
  const qrCodeObjLink = ref();
  

  watchEffect(async () => {
    if (inscription.value?.transferPaymentProofLink) {
      try {
        const res = await $api(inscription.value.transferPaymentProofLink, {
          responseType: "blob",
        });
        transferProofObjUrl.value = URL.createObjectURL(res);
      } catch (e) {
        console.error("Error fetching transfer proof image", e);
      }
    }
  });

  watchEffect(async () => {
    if (inscription.value?.qrCodeLink) {
      try {
        const res = await $api(inscription.value.qrCodeLink, {
          responseType: "blob",
        });
        qrCodeObjLink.value = URL.createObjectURL(res);
      } catch (e) {
        console.error("Error fetching QR image", e);
      }
    }
  });
  definePageMeta({
    title: "Escaneo de Inscripción",
    layout: "admin",
  });
</script>
<style scoped></style>
