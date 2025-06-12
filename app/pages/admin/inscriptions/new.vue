<template>
  <div class="container mx-auto h-full pt-4">
    <div class="flex flex-col h-full">
      <div class="">
        <Button as-child size="sm" variant="link" class="mb-3">
          <NuxtLink to="/admin/inscriptions">
            <Icon name="lucide:arrow-left" />
            Volver a Inscripciones
          </NuxtLink>
        </Button>

        <h1 class="text-2xl font-bold">Crear Inscripción</h1>
      </div>

      <Stepper
        class="flex w-full items-start gap-2 relative"
        v-model="stepIndex"
      >
        <StepperItem
          v-for="step in steps"
          :key="step.step"
          v-slot="{ state }"
          class="flex w-full flex-col items-center justify-center"
          :step="step.step"
        >
          <div
            class="z-10 rounded-full shrink-0 p-2"
            :class="[
              state === 'active' && 'outline-2 outline-ring outline-offset-2',
            ]"
            @click="() => undefined"
          >
            <Icon name="lucide:check" v-if="state === 'completed'" />
            <Icon :name="step.icon" v-else />
          </div>

          <StepperTitle
            :class="[state === 'active' && 'text-primary']"
            class="absolute top-full mt-4 w-max -translate-x-1/2 left-1/2 text-xl font-semibold"
            v-if="state === 'active'"
          >
            {{ step.title }}
          </StepperTitle>
        </StepperItem>
      </Stepper>
      <Form
        @submit="handleNextStep"
        :validation-schema="currentSchema"
        keep-values
        class="flex flex-col flex-1 pt-6"
      >
        <div
          class="flex-1 overflow-auto self-center w-full max-w-2xl px-4 pt-10"
        >
          <template v-if="stepIndex === 1">
            <fieldset class="gap-4 grid grid-cols-1">
              <FormField v-slot="{ componentField, meta }" name="firstName">
                <FormItem>
                  <FormLabel :required="meta.required" icon="lucide:user"
                    >Nombre</FormLabel
                  >
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="firstName" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField, meta }" name="lastName">
                <FormItem>
                  <FormLabel :required="meta.required" icon="lucide:user">
                    Apellido
                  </FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="lastName" />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField, meta }"
                name="identificationDocument"
              >
                <FormItem>
                  <FormLabel :required="meta.required" icon="lucide:id-card"
                    >Numero de Identificacion (DPI o Pasaporte)</FormLabel
                  >
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormDescription class="text-xs">
                    *DPI solo valido para nacionales Guatemaltecos
                  </FormDescription>
                  <FormMessage name="id" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField, meta }" name="phone">
                <FormItem>
                  <FormLabel :required="meta.required" icon="lucide:phone"
                    >Telefono</FormLabel
                  >
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="phone" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField, meta }" name="email">
                <FormItem>
                  <FormLabel :required="meta.required" icon="lucide:mail"
                    >Correo Electronico</FormLabel
                  >
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="email" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField, meta }" name="voucherNumber">
                <FormItem>
                  <FormLabel icon="lucide:receipt" :required="meta.required"
                    >Numero de comprobante de pago</FormLabel
                  >
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="voucherNumber" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField, meta }" name="organisation">
                <FormItem>
                  <FormLabel icon="lucide:school">Universidad</FormLabel>

                  <Combobox by="label" v-bind="componentField">
                    <FormControl>
                      <ComboboxAnchor as-child class="">
                        <ComboboxTrigger as-child class="">
                          <Button
                            variant="outline"
                            class="justify-between rounded-md py-2.5 min-w-full max-w-full normal-case tracking-normal"
                          >
                            <span class="truncate font-normal">
                              {{
                                componentField.modelValue ??
                                "Selecciona una universidad..."
                              }}
                            </span>
                            <Icon
                              name="lucide:chevrons-up-down"
                              class="ml-2 h-4 w-4 shrink-0 opacity-50"
                            />
                          </Button>
                        </ComboboxTrigger>
                      </ComboboxAnchor>
                    </FormControl>
                    <ComboboxList class="max-h-[300px] overflow-y-auto !block">
                      <div class="relative w-full items-center">
                        <ComboboxInput
                          class="pl-0 focus-visible:ring-0 rounded-none h-10"
                          placeholder="Buscar universidad..."
                          :autoFocus="false"
                        />
                        <span
                          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                        >
                          <Icon name="lucide:search" class="h-4 w-4 opacity-50">
                          </Icon>
                        </span>
                      </div>

                      <ComboboxEmpty class="w-full">
                        No se encontraron resultados.
                      </ComboboxEmpty>

                      <ComboboxGroup
                        v-for="group in universitiesList"
                        :heading="group.group"
                        :key="group.group"
                      >
                        <ComboboxItem
                          v-for="uni in group.items"
                          :key="uni"
                          :value="uni"
                          class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold"
                        >
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
              <FormField v-slot="{ value, handleChange }" name="isAuthor">
                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      class="size-6"
                      :default-value="value"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                  <FormLabel class="cursor-pointer" icon="lucide:pencil-line"
                    >¿Persona es autor de un trabajo de
                    investigacion/ponencia/taller?</FormLabel
                  >
                  <FormMessage name="isAuthor" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ value, handleChange }" name="isGuest">
                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      class="size-6"
                      :default-value="value"
                      @update:model-value="handleChange"
                    />
                  </FormControl>
                  <FormLabel class="cursor-pointer" icon="lucide:user-plus"
                    >¿Persona es Invitado?</FormLabel
                  >
                  <FormMessage name="isGuest" />
                </FormItem>
              </FormField>
            </fieldset>
          </template>

          <template v-if="stepIndex === 2">
            <fieldset class="gap-4 grid grid-cols-1">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel icon="lucide:user">Nombre</FormLabel>
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel icon="lucide:user"> Apellido </FormLabel>
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="identificationDocument"
              >
                <FormItem>
                  <FormLabel icon="lucide:id-card"
                    >Numero de Identificacion (DPI o Pasaporte)</FormLabel
                  >
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel icon="lucide:phone">Telefono</FormLabel>
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel icon="lucide:mail">Correo Electronico</FormLabel>
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="organisation">
                <FormItem>
                  <FormLabel icon="lucide:school">Universidad</FormLabel>
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ value }" name="isAuthor">
                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox class="size-6" :default-value="value" disabled />
                  </FormControl>
                  <FormLabel class="cursor-pointer" icon="lucide:pencil-line"
                    >¿Persona es autor de un trabajo de
                    investigacion/ponencia/taller?</FormLabel
                  >
                </FormItem>
              </FormField>
              <FormField v-slot="{ value }" name="isGuest">
                <FormItem class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox class="size-6" :default-value="value" disabled />
                  </FormControl>
                  <FormLabel class="cursor-pointer" icon="lucide:user-plus"
                    >¿Persona es Invitado?</FormLabel
                  >
                </FormItem>
                <FormMessage name="isGuest" />
              </FormField>
              <FormField v-slot="{ componentField }" name="voucherNumber">
                <FormItem>
                  <FormLabel icon="lucide:receipt"
                    >Numero de comprobante de pago</FormLabel
                  >
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </FormField>
            </fieldset>
          </template>
        </div>
        <div class="w-full grid grid-cols-2 sticky bottom-0 bg-background">
          <Button
            variant="outline"
            class="rounded-none group"
            @click="handlePrevStep"
            :disabled="stepIndex === 1"
            type="button"
          >
            <Icon
              name="lucide:chevron-left"
              class="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Anterior
          </Button>
          <Button
            variant="outline"
            class="rounded-none group"
            v-if="stepIndex !== steps.length"
            type="submit"
          >
            Siguiente
            <Icon
              name="lucide:chevron-right"
              class="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Button>

          <Button
            variant="outline"
            class="rounded-none group"
            v-if="stepIndex === steps.length"
            type="submit"
            :loading="asyncStatus === 'loading'"
          >
            Finalizar
            <Icon name="lucide:check" />
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Stepper, StepperItem, StepperTitle } from "@/components/ui/stepper";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "vue-sonner";
  import * as z from "zod";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
  } from "~/components/ui/combobox";
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "~/components/ui/form";
  import { createInscriptionByAdmin } from "~/lib/api/admin/inscriptions";

  const stepIndex = ref(1);
  const schemas = [
    toTypedSchema(
      z.object({
        firstName: z
          .string({ message: "Campo requerido" })
          .min(1, "El nombre debe contener al menos 1 caracter")
          .max(50, { message: "Máximo 50 caracteres" }),
        lastName: z
          .string({ message: "Campo requerido" })
          .min(1, "El apellido debe contener al menos 1 caracter")
          .max(50, { message: "Máximo 50 caracteres" }),
        identificationDocument: z
          .string({ message: "Campo requerido" })
          .min(5, "DPI o Pasaporte requerido")
          .max(30, { message: "Máximo 30 caracteres" }),
        phone: z
          .string({ message: "Campo requerido" })
          .min(6, "Número inválido")
          .max(20, { message: "Máximo 20 caracteres" }),
        email: z
          .string({ message: "Campo requerido" })
          .max(100, { message: "Máximo 100 caracteres" })
          .email("Correo inválido"),
        organisation: z
          .string({ message: "Campo requerido" })
          .min(1)
          .max(100, { message: "Máximo 100 caracteres" }),
        isAuthor: z.boolean().default(false),
        isGuest: z.boolean().default(false),
        voucherNumber: z
          .string()
          .max(50, { message: "Máximo 50 caracteres" })
          .optional(),
      }),
    ),
  ];
  const currentSchema = computed(() => {
    return schemas[stepIndex.value - 1];
  });

  const { mutate, asyncStatus } = useMutation({
    mutation: (values) => createInscriptionByAdmin(values),
    onSuccess: () => {
      toast.success("Inscripción guardada correctamente");
      navigateTo("/admin/inscriptions");
    },

    onError: (error) => {
      const CustomDiv = defineComponent({
        setup() {
          return () =>
            h("div", {
              innerHTML: `
               <h2 class="font-semibold mb-2">No se ha podido registrar la inscripción</h2>
                <p class="text-sm text-muted-foreground"> 
               ${error.data?.message || error.name || "Error desconocido"}
                </p>
               `,
            });
        },
      });

      toast.error(markRaw(CustomDiv));
    },
  });

  function handleNextStep(values) {
    if (stepIndex.value === 2) {
      mutate(values);
      return;
    }

    stepIndex.value++;
  }

  function handlePrevStep() {
    if (stepIndex.value === 1) {
      return;
    }

    stepIndex.value--;
  }

  const steps = [
    {
      step: 1,
      title: "Datos Personales",
      description: "Provide your name and email",
      icon: "lucide:user",
    },
    {
      step: 2,
      title: "Confirmacion de Datos",
      description: "Start collaborating with your team",
      icon: "lucide:user-check",
    },
  ];
</script>
<style scoped></style>
