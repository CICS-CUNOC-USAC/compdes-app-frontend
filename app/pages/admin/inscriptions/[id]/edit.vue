<template>
  <div class="container mx-auto p-5">
    <div class="">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink :to="`/admin/inscriptions/${route.params.id}`">
          <Icon name="lucide:arrow-left" />
          Volver a Inscripción
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/inscriptions">
          <Icon name="lucide:list" />
          Volver a Inscripciones
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:house" />
          Volver a Inicio
        </NuxtLink>
      </Button>

      <h1 class="text-2xl font-bold">Editar Inscripción</h1>
    </div>

    <div v-if="error" class="text-destructive-foreground">
      No hemos podido cargar la inscripción
    </div>

    <LoaderIndicator v-if="status === 'pending'" />

    <Form v-else-if="inscription" class="mt-3" @submit="handleSubmit" :validation-schema="schema"
      :initial-values="inscription">
      <h2 class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4">
        Acciones:
      </h2>
      <div class="mb-5 space-x-2 space-y-2">
        <Button size="sm" variant="default" type="submit" :loading="asyncStatus === 'loading'">
          <Icon name="lucide:check" />
          Guardar Cambios
        </Button>
      </div>

      <h2 class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4">
        Información:
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">Nombre y apellido</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="firstName" />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="lastName" />
              </FormItem>
            </FormField>
          </div>

        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            Universidad
          </h2>
          <FormField v-slot="{ componentField }" name="organisation">
            <FormItem>
              <Combobox by="label" v-bind="componentField">
                <FormControl>
                  <ComboboxAnchor as-child class="">
                    <ComboboxTrigger as-child class="">
                      <Button variant="outline"
                        class="justify-between rounded-md py-2.5 min-w-full max-w-full normal-case tracking-normal">
                        <span class="truncate font-normal">
                          {{
                            componentField.modelValue ??
                            "Selecciona una universidad..."
                          }}
                        </span>
                        <Icon name="lucide:chevrons-up-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </ComboboxTrigger>
                  </ComboboxAnchor>
                </FormControl>
                <ComboboxList class="max-h-[300px] overflow-y-auto !block">
                  <div class="relative w-full items-center">
                    <ComboboxInput class="pl-0 focus-visible:ring-0 rounded-none h-10"
                      placeholder="Buscar universidad..." :autoFocus="false" />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                      <Icon name="lucide:search" class="h-4 w-4 opacity-50">
                      </Icon>
                    </span>
                  </div>

                  <ComboboxEmpty class="w-full">
                    No se encontraron resultados.
                  </ComboboxEmpty>

                  <ComboboxGroup v-for="group in universitiesList" :heading="group.group" :key="group.group">
                    <ComboboxItem v-for="uni in group.items" :key="uni" :value="uni"
                      class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold">
                      <ComboboxItemIndicator>
                        <Icon name="lucide:check" class="size-4" />
                      </ComboboxItemIndicator>
                      {{ uni }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormMessage name="organisation" />
            </FormItem>
          </FormField>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            Correo electrónico
          </h2>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormControl>
                <Input type="email" v-bind="componentField" />
              </FormControl>
              <FormMessage name="email" />
            </FormItem>
          </FormField>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">Teléfono</h2>
          <div class="flex gap-4 w-full">
            <!-- phone country selector -->
            <FormField v-slot="{ componentField }" name="phone" class="">
              <FormItem class="w-full self-start">
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="phone" />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            Documento de Identificación
          </h2>
          <FormField v-slot="{ componentField }" name="identificationDocument">
            <FormItem>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage name="identificationDocument" />
            </FormItem>
          </FormField>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            ¿Es autor?
          </h2>
          <FormField v-slot="{ value, handleChange }" name="isAuthor">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <Checkbox class="size-6" :default-value="value" @update:model-value="handleChange" />
              </FormControl>
              <FormMessage name="isAuthor" />
            </FormItem>
          </FormField>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            ¿Es invitado?
          </h2>
          <FormField v-slot="{ value, handleChange }" name="isGuest">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <Checkbox class="size-6" :default-value="value" disabled @update:model-value="handleChange" />
              </FormControl>
              <FormMessage name="isGuest" />
            </FormItem>
          </FormField>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">Estado</h2>
          <span class="mt-1 inline-block px-3 py-1 rounded-full text-sm" :class="inscription.registrationStatus.isApproved
            ? 'text-green-800 dark:text-green-900 bg-green-100 dark:bg-green-200'
            : 'text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200'
            ">
            {{
              inscription.registrationStatus.isApproved
                ? "Aprobado"
                : "Pendiente"
            }}
          </span>
        </div>
        <div v-if="inscription.qrCodeLink">
          <h3 class="font-semibold text-sm text-muted-foreground mb-1">Codigo QR</h3>
          <img v-if="qrCodeObjLink" :src="qrCodeObjLink" alt="Codigo QR" />
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            Método de pago
          </h2>
          <p class="mt-1 text-lg">
            <span v-if="inscription.isCardPayment">Tarjeta</span>
            <span v-else-if="inscription.isTransferPayment">Transferencia</span>
            <span v-else>Cash</span>
          </p>
        </div>

        <div v-if="inscription.cardPaymentProofLink" class="mt-4">
          <h3 class="font-semibold text-sm text-muted-foreground mb-1">
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
          <h3 class="font-semibold text-sm text-muted-foreground mb-1">
            Identificador de pago (Talonario) #
          </h3>
          <p class="mt-1 text-lg">
            {{ inscription.registrationStatus.voucherNumber }}
          </p>
        </div>

        <div v-if="inscription.transferPaymentProofLink" class="mt-4">
          <h3 class="font-semibold text-sm text-muted-foreground mb-1">
            Comprobante de pago (Transferencia)
          </h3>
          <img v-if="transferProofObjUrl" :src="transferProofObjUrl" alt="Comprobante de pago" class="w-90 h-auto" />
        </div>
      </div>
    </Form>
  </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import { z } from "zod";
import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
import {
  getInscriptionByAdmin,
  updateInscriptionByAdmin,
  type Inscription,
  type InscriptionData
} from "~/lib/api/admin/inscriptions";


const imageObjUrl = ref(null);

const abortController = new AbortController();

const route = useRoute();
const {
  data: inscription,
  error,
  status,
} = await useAsyncData<Inscription>(() => getInscriptionByAdmin(route.params.id as string));

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


// Form Handling
const schema = toTypedSchema(
  z.object({
    firstName: z
      .string({ message: "Campo requerido" })
      .min(1, "El nombre debe contener al menos 1 caracter")
      .max(100),
    lastName: z
      .string({ message: "Campo requerido" })
      .min(1, "El apellido debe contener al menos 1 caracter")
      .max(100),
    identificationDocument: z
      .string({ message: "Campo requerido" })
      .min(5, "DPI o Pasaporte requerido"),
    phone: z
      .string({ message: "Campo requerido" })
      .min(6, "Número inválido"),
    email: z
      .string({ message: "Campo requerido" })
      .email("Correo inválido"),
    organisation: z.string({ message: "Campo requerido" }).min(1),
    isAuthor: z.boolean().default(false),
  }),
)


const { mutate: udpateInscription, asyncStatus } = useMutation({
  mutation: (values: Omit<InscriptionData, "voucherNumber">) => updateInscriptionByAdmin(route.params.id as string, values),
  onSuccess: () => {
    toast.success("Inscripción actualizada correctamente");
    navigateTo(`/admin/inscriptions/${route.params.id}`);
  },
  onError: (error) => {
    toast.error(`No se ha podido actualizar la inscripción: ${error.data?.message || error.name}`);
  },
});

function handleSubmit(values: Omit<InscriptionData, "voucherNumber">) {
  udpateInscription(values);
}
const transferProofObjUrl = ref();

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

const qrCodeObjLink = ref();

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
  title: "Editar Inscripción",
  layout: "admin",
});
</script>
