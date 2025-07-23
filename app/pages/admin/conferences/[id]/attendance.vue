<template>
  <div class="container mx-auto p-5">
    <div class="">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/conferences">
          <Icon name="lucide:arrow-left" />
          Volver a Actividades
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:house" />
          Volver a Inicio
        </NuxtLink>
      </Button>

      <h1 class="text-2xl font-bold">Registrar asistencia de actividad</h1>
    </div>

    <div v-if="error" class="text-red-600">Failed to load activity.</div>

    <LoaderIndicator v-if="status === 'pending'" />

    <div v-else class="mt-3">
      <h2
        class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4"
      >
        Información:
      </h2>

      <div>
        <h2 class="font-semibold text-sm text-muted-foreground">
          <Icon class="inline mb-0.5" name="lucide:user" /> Nombre
        </h2>
        <p class="mt-1 text-lg">{{ activity?.name }}</p>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger class="border-b border-border rounded-none"
            >Más información</AccordionTrigger
          >
          <AccordionContent>
            <div class="md:col-span-2 pt-4">
              <h2 class="font-semibold text-sm text-muted-foreground">
                <Icon class="inline mb-0.5" name="lucide:calendar" />
                Programación
              </h2>
              <p class="mt-1 text-lg">
                <span class="text-base text-muted-foreground">
                  <Icon class="inline mb-0.5" name="lucide:clock-arrow-up" />
                  Inicio:
                </span>
                {{ formatDate(activity?.initScheduledDate) }}<br />
                <span class="text-base text-muted-foreground">
                  <Icon class="inline mb-0.5" name="lucide:clock-arrow-down" />
                  Fin:
                </span>
                {{ formatDate(activity?.endScheduledDate) }}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h2
        class="uppercase tracking-wider text-muted-foreground text-sm font-light my-4"
      >
        Asistencia:
      </h2>

      <p v-if="qrReaderError" class="text-red-600">
        No hemos podido leer el código QR: {{ qrReaderError }}
      </p>
      <div class="pb-2 text-xs">
        <template v-if="!result"> Esperando a leer el código QR... </template>
        <template v-if="true">
          <p>
            ID leído: <strong>{{ result }}</strong>
          </p>
          <Label class="my-2.5 text-lg cursor-pointer">
            <Switch v-model="entrance" class="py-3 w-10" thumb-class="py-2.5 px-2.5"/>
            {{ entrance ? "Entrada" : "Salida" }}
          </Label>
          <div class="mt-1 mb-0.5 flex gap-2">
            <Button
              @click="handleConfirmAttendance"
              variant="default"
              class="flex-1"
              size="sm"
              >Guardar</Button
            >
            <Button @click="clearResult" variant="outline" size="sm"
              >Limpiar</Button
            >
          </div>
        </template>
      </div>
      <div
        class="rounded-lg ring-1 ring-black/25 shadow-lg overflow-hidden aspect-square bg-white"
      >
        <QrcodeStream
          :paused="paused"
          :track="paintOutline"
          @error="onError"
          @detect="onDetect"
          @camera-on="onCameraReady"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  import { QrcodeStream, type DetectedBarcode } from "vue-qrcode-reader";
  import { toast } from "vue-sonner";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import Button from "~/components/ui/button/Button.vue";
  import { Label } from "~/components/ui/label";
  import type { Activity } from "~/lib/api/conferencias";

  const route = useRoute();
  const {
    data: activity,
    error,
    status,
  } = await useAsyncData<Activity>(() =>
    $api(`/activities/${route.params.id}`),
  );

  // QR Code handling
  const qrReaderError = ref("");
  const paused = ref(false);

  const result = ref("");

  const entrance = ref(true);

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

  // ends QR Code handling

  function handleConfirmAttendance() {
    if (!result.value) {
      toast.error("No se ha leído ningún código QR");
      return;
    }

    // Aquí puedes manejar la confirmación de asistencia
    // toast.success(`Asistencia confirmada para el ID: ${result.value}`);
    confirmAttendance({
      qrCode: result.value,
      activityId: activity.value?.id || "",
      entrance: entrance.value,
    });
  }

  const { mutate: confirmAttendance, asyncStatus } = useMutation({
    mutation: ({
      qrCode,
      activityId,
      entrance,
    }: {
      qrCode: string;
      activityId: string | number;
      entrance: boolean;
    }) => {
      const finalUrl = entrance ? `/attendances/create` : `/attendances/exit`;
      const method = entrance ? "POST" : "PATCH";

      return $api(finalUrl, {
        method,
        body: {
          qrCode,
          activityId,
        },
      });
    },
    onSuccess: () => {
      toast.success("Asistencia registrada correctamente");
      clearResult();
    },
    onError: (error) => {
      toast.error(
        `Error al registrar asistencia: ${error.data?.message || error.name}`,
      );
      clearResult();
    },
  });

  definePageMeta({
    layout: "admin",
    title: "Detalles de Actividad",
  });

  function formatDate(dateString?: string): string {
    return dateString
      ? format(new Date(dateString), "HH:mm 'del' EEEE dd 'de' MMMM yyyy", {
          locale: es,
        })
      : "Fecha no disponible";
  }
</script>
