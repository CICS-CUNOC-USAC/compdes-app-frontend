<template>
  <!-- <button
  @click="() => stepIndex++"
  >
    test
  </button> -->
  <div class="flex flex-col h-full pt-4">
    <Stepper class="flex w-full items-start gap-2 relative" v-model="stepIndex">
      <StepperItem
        v-for="step in steps"
        :key="step.step"
        v-slot="{ state }"
        class="flex w-full flex-col items-center justify-center"
        :step="step.step"
      >
        <!-- <StepperSeparator
          v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
        /> -->

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
    <!-- <div class="flex flex-col gap-4 mt-16 items-center w-full p-2 flex-1"> -->
    <Form
      @submit="handleNextStep"
      :validation-schema="currentSchema"
      keep-values
      class="flex flex-col flex-1 pt-6"
    >
      <div class="flex-1 overflow-auto self-center w-full max-w-xl px-4">
        <template v-if="stepIndex === 1">
          <fieldset class="gap-4 grid grid-cols-1">
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormLabel icon="lucide:user">Nombre</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="firstName" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormLabel icon="lucide:user"> Apellido </FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="lastName" />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="id">
              <FormItem>
                <FormLabel icon="lucide:id-card"
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
            <FormField v-slot="{ componentField }" name="phone">
              <FormItem>
                <FormLabel icon="lucide:phone">Telefono</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="phone" />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel icon="lucide:mail">Correo Electronico</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="university">
              <FormItem>
                <FormLabel icon="lucide:school">Universidad</FormLabel>

                <Combobox by="label" v-bind="componentField">
                  <FormControl>
                    <ComboboxAnchor as-child class="">
                      <ComboboxTrigger as-child class="">
                        <Button
                          variant="outline"
                          class="justify-between rounded-md py-2.5 min-w-full max-w-full"
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
                <FormMessage name="university" />
              </FormItem>
            </FormField>
          </fieldset>
        </template>
        <template v-if="stepIndex === 2">
          <div class="px-4 text-foreground">
            <p class="text-base font-medium">
              Puedes realizar el pago con tu tarjeta de
              <span class="font-semibold text-brand-red"
                >Débito o Crédito VISA, MASTERCARD</span
              >
              por un monto de <span class="font-black">$45.00</span>.
              <br />
              <span class="text-sm text-muted-foreground"
                >(No se aceptan transferencias)</span
              >
            </p>

            <ol class="list-decimal space-y-2 text-sm leading-relaxed">
              <li>Ingresa tu nombre completo.</li>
              <li>Ingresa tu correo electrónico.</li>
              <li>Llena el formulario de pago con los datos de tu tarjeta.</li>
              <li>Elige el país al que pertenece tu tarjeta.</li>
              <li>Procede con el pago.</li>
              <li>
                Guarda el link de tu pago exitoso en la opcion 'Compartir
                Comprobante'.
              </li>
              <li>Recibirás un mensaje de confirmación en tu correo.</li>
              <li>Ingresa el link del comprobante en el siguiente paso.</li>
            </ol>

            <Button as-child class="self-center">
              <NuxtLink
                to="https://app.recurrente.com/checkout-session/ch_gzv3nkfdre74yqqq"
                class="text-center mt-2"
                target="_blank"
              >
                <Icon name="lucide:wallet" />
                Ingresa a este link para realizar tu pago
              </NuxtLink>
            </Button>
          </div>
        </template>

        <template v-if="stepIndex === 3">
          <FormField name="receiptUrl" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Link de Comprobante</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </template>

        <template v-if="stepIndex === 4">
          <div class="flex flex-row px-2 gap-x-2">
            <FormField name="firstName">
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="lastName">
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input type="text" disabled />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <FormField name="id">
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input type="text" disabled />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="phone">
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <Input type="text" disabled />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="email">
            <FormItem>
              <FormLabel>Correo Electronico</FormLabel>
              <FormControl>
                <Input type="text" disabled />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="university">
            <FormItem>
              <FormLabel>Universidad</FormLabel>
              <FormControl>
                <Input type="text" disabled />
              </FormControl>
            </FormItem>
          </FormField>
        </template>
      </div>
      <div class="w-full grid grid-cols-2 sticky bottom-0 bg-background">
        <Button
          variant="outline"
          class="rounded-none"
          @click="handlePrevStep"
          :disabled="stepIndex === 1"
          type="button"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          class="rounded-none"
          v-if="stepIndex !== steps.length"
          type="submit"
        >
          Siguiente
        </Button>

        <Button
          variant="outline"
          class="rounded-none"
          v-if="stepIndex === steps.length"
          type="submit"
        >
          Finalizar
        </Button>
      </div>
    </Form>
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
  import { FormField, NuxtLink } from "#components";
  import { Button } from "@/components/ui/button";
  import { Form } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import {
    Stepper,
    StepperItem,
    StepperSeparator,
    StepperTitle,
  } from "@/components/ui/stepper";
  import { toTypedSchema } from "@vee-validate/zod";
  import { ComboboxLabel } from "reka-ui";
  import { ErrorMessage, Field, useForm } from "vee-validate";
  import * as z from "zod";
  import Combobox from "~/components/ui/combobox/Combobox.vue";
  import ComboboxAnchor from "~/components/ui/combobox/ComboboxAnchor.vue";
  import ComboboxEmpty from "~/components/ui/combobox/ComboboxEmpty.vue";
  import ComboboxGroup from "~/components/ui/combobox/ComboboxGroup.vue";
  import ComboboxInput from "~/components/ui/combobox/ComboboxInput.vue";
  import ComboboxItem from "~/components/ui/combobox/ComboboxItem.vue";
  import ComboboxItemIndicator from "~/components/ui/combobox/ComboboxItemIndicator.vue";
  import ComboboxList from "~/components/ui/combobox/ComboboxList.vue";
  import ComboboxTrigger from "~/components/ui/combobox/ComboboxTrigger.vue";
  import FormControl from "~/components/ui/form/FormControl.vue";
  import FormDescription from "~/components/ui/form/FormDescription.vue";
  import FormItem from "~/components/ui/form/FormItem.vue";
  import FormLabel from "~/components/ui/form/FormLabel.vue";
  import Select from "~/components/ui/select/Select.vue";
  import SelectContent from "~/components/ui/select/SelectContent.vue";
  import SelectGroup from "~/components/ui/select/SelectGroup.vue";
  import SelectItem from "~/components/ui/select/SelectItem.vue";
  import SelectLabel from "~/components/ui/select/SelectLabel.vue";
  import SelectTrigger from "~/components/ui/select/SelectTrigger.vue";
  import SelectValue from "~/components/ui/select/SelectValue.vue";

  const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
  ] as const;

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const value = ref<(typeof frameworks)[0]>();

  const stepIndex = ref(1);
  const schemas = [
    toTypedSchema(
      z.object({
        firstName: z
          .string({ message: "Campo requerido" })
          .min(1, "El nombre debe contener al menos 1 caracter")
          .max(100),
        lastName: z
          .string({ message: "Campo requerido" })
          .min(1, "El apellido debe contener al menos 1 caracter")
          .max(100),
        id: z
          .string({ message: "Campo requerido" })
          .min(5, "DPI o Pasaporte requerido"),
        phone: z
          .string({ message: "Campo requerido" })
          .min(6, "Número inválido"),
        email: z
          .string({ message: "Campo requerido" })
          .email("Correo inválido"),
        university: z.string({ message: "Campo requerido" }).min(1),
        // receiptUrl: z
        //   .string()
        //   .url("Debe ingresar un enlace válido al comprobante"),
      }),
    ),
    undefined, // Step 2 does not require validation
    toTypedSchema(
      z.object({
        receiptUrl: z
          .string()
          .url("Debe ingresar un enlace válido al comprobante"),
      }),
    ),
  ];
  const currentSchema = computed(() => {
    return schemas[stepIndex.value - 1];
  });

  function handleNextStep(values) {
    console.log("Current Step: ", values);
    if (stepIndex.value === 4) {
      console.log("Done: ", JSON.stringify(values, null, 2));
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
      title: "Instrucciones de Pago",
      description: "A few details about your company",
      icon: "lucide:wallet",
    },
    {
      step: 3,
      title: "Comprobacion de Pago",
      description: "Start collaborating with your team",
      icon: "lucide:receipt",
    },
    {
      step: 4,
      title: "Confirmacion de Datos",
      description: "Start collaborating with your team",
      icon: "lucide:users",
    },
  ];
</script>
