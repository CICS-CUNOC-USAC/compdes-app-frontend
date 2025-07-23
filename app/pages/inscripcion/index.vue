<template>
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
    <Form
      @submit="handleNextStep"
      :validation-schema="currentSchema"
      keep-values
      class="flex flex-col flex-1 pt-6"
      #="{ values }"
    >
      <div class="flex-1 overflow-auto self-center w-full max-w-2xl px-4 pt-10">
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
            <FormField
              v-slot="{ componentField }"
              name="identificationDocument"
            >
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

            <div class="flex gap-4 w-full">
              <!-- phone country selector -->
              <FormField v-slot="{ componentField }" name="areaCode">
                <FormItem>
                  <FormLabel icon="lucide:map">Código de area</FormLabel>

                  <Combobox by="label" v-bind="componentField" class="">
                    <!-- {{ componentField }} -->
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
                                "Seleccionar país"
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
                          placeholder="Buscar país..."
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

                      <ComboboxItem
                        v-for="areaCode in callingCountries.all"
                        :key="areaCode.alpha2"
                        :value="areaCode.countryCallingCodes[0]"
                        class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold"
                      >
                        <ComboboxItemIndicator>
                          <Icon name="lucide:check" class="size-4" />
                        </ComboboxItemIndicator>
                        {{ areaCode.emoji }}
                        <span class="font-medium">{{ areaCode.name }}</span>
                        <code class="text-xs text-muted-foreground"
                          >({{ areaCode.countryCallingCodes[0] }})</code
                        >
                      </ComboboxItem>
                    </ComboboxList>
                  </Combobox>
                  <FormDescription class="text-xs">
                    (Nombres de paises en inglés)
                  </FormDescription>
                  <FormMessage name="areaCode" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField, errors }" name="phone" class="">
                <FormItem class="w-full self-start">
                  <FormLabel icon="lucide:phone">Telefono</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="phone" />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel icon="lucide:mail">Correo Electronico</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="organisation">
              <FormItem>
                <FormLabel icon="lucide:school">Universidad/Organizacion</FormLabel>

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
                  >¿Eres autor de un trabajo de
                  investigacion/ponencia/taller?</FormLabel
                >
                <FormMessage name="isAuthor" />
              </FormItem>
            </FormField>
          </fieldset>
        </template>
        <template v-if="stepIndex === 2">
          <h3 class="text-center pb-3">
            Por favor, elige la forma de pago que utilizarás para completar tu
            inscripción al congreso.
          </h3>

          <Alert class="mb-4">
            <Icon name="lucide:info" class="size-4" />
            <AlertTitle> ¿Tienes algún inconveniente con el pago? </AlertTitle>
            <!-- <h3 class="text-sm font-semibold mb-1 text-muted-foreground">
              
            </h3> -->
            <AlertDescription class="text-sm block">
              Puedes comunicarte al correo
              <a
                href="mailto:enriquetebalan202230026@cunoc.edu.gt"
                class="text-primary hover:underline font-semibold"
                >enriquetebalan202230026@cunoc.edu.gt
              </a>
              obtener para asistencia.
            </AlertDescription>
          </Alert>

          <Tabs default-value="nacional" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="nacional"> Nacional </TabsTrigger>
              <TabsTrigger value="extranjero"> Extranjero </TabsTrigger>
            </TabsList>
            <TabsContent value="nacional">
              <ul class="list-disc pl-5 space-y-3">
                <li>
                  Realiza el pago de <strong>Q350.00</strong> mediante
                  depósitos, transferencias o pagos en efectivo.
                </li>
                <li>
                  Para depósitos y transferencias a la cuenta:<br />

                  <div class="p-3.5 bg-accent rounded-md">
                    <strong>Banco:</strong> Banrural<br />
                    <strong>Nombre:</strong> Enrique Alexander Tebalán
                    Hernandez<br />
                    <strong>Tipo de cuenta:</strong> Cuenta de ahorros<br />
                    <strong>Número de cuenta:</strong> 4034284384<br />
                    <strong>Moneda:</strong> Quetzales
                  </div>
                </li>
                <li>
                  Para pagos en efectivo, acércate al stand de pago en la
                  entrada del módulo G-Cunoc desde las
                  <span class="font-bold">13:00</span> horas a
                  <span class="font-bold">15:00</span> horas y desde las
                  <span class="font-bold">17:00</span> horas a
                  <span class="font-bold">19:00</span> horas, de lunes a viernes
                  (durante junio 2025).
                </li>
                <li>
                  Guarda tu recibo de pago, boleta bancaria de pago o captura de
                  transferencia exitosa y adjunta dos fotografías de comprobante
                  de pago (recibo de pago y boleta bancaria o captura de
                  transferencia) junto con tus datos.
                </li>
              </ul>

              <div class="flex flex-col gap-6 items-center pt-4 pb-10">
                <img
                  src="~/assets/img/banrural-pago2.jpeg"
                  class="w-56 h-[335px] outline outline-gray-300 rounded-xl"
                />
                <img
                  src="~/assets/img/banrural-pago.jpeg"
                  class="w-[450px] h-[200px] md:h-[315px] outline outline-gray-300 rounded-xl"
                />
              </div>
            </TabsContent>
            <TabsContent value="extranjero" class="space-y-6 px-6">
              <div class="space-y-4">
                <p class="text-base font-medium">
                  Puedes realizar el pago con tu tarjeta
                  <span class="font-semibold text-brand-red"
                    >Débito o Crédito VISA, MASTERCARD</span
                  >
                  por un monto de <span class="font-black">$45.00</span>.
                  <br />
                  <span class="text-sm text-muted-foreground"
                    >(No se aceptan transferencias)</span
                  >
                </p>

                <p class="text-base font-medium">
                  Para las personas que asistirán de forma virtual desde
                  Nicaragua, el monto a pagar es de
                  <span class="font-black">$30.00</span>.
                </p>
              </div>

              <ol class="list-decimal space-y-2 text-sm leading-relaxed">
                <li>Ingresa tu nombre completo.</li>
                <li>Ingresa tu correo electrónico.</li>
                <li>
                  Llena el formulario de pago con los datos de tu tarjeta.
                </li>
                <li>Elige el país al que pertenece tu tarjeta.</li>
                <li>Procede con el pago.</li>
                <li>
                  Guarda el link de tu pago exitoso en la opcion 'Compartir
                  Comprobante'.
                </li>
                <li>Recibirás un mensaje de confirmación en tu correo.</li>
                <li>Ingresa el link del comprobante en el siguiente paso.</li>
              </ol>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Button
                  as-child
                  class="self-center text-center flex-col rounded-sm"
                  variant="outline"
                  size="expand"
                >
                  <NuxtLink
                    to="https://app.recurrente.com/s/pago-compdes-2025-quetzaltenango/pago-de-inscripcion-a-congreso-compdes-2025-quetzaltenango-guatemala-qrauvp"
                    class="w-full"
                    target="_blank"
                  >
                    <Icon name="lucide:user" class="size-5" />
                    <span
                      ><span class="font-bold">Modalidad Presencial</span>
                      <br />Ingresa a este link para realizar tu pago
                    </span>
                  </NuxtLink>
                </Button>

                <Button
                  as-child
                  class="self-center text-center flex-col rounded-sm"
                  variant="outline"
                  size="expand"
                >
                  <NuxtLink
                    to="https://app.recurrente.com/s/pago-compdes-2025-quetzaltenango/pago-de-inscripcion-a-compdes-2025-de-manera-virtual"
                    class="w-full h-full"
                    target="_blank"
                  >
                    <Icon name="lucide:laptop" class="size-5" />
                    <span
                      ><span class="font-bold">Modalidad Virtual</span>
                      <br />Ingresa a este link para realizar tu pago
                    </span>
                  </NuxtLink>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </template>

        <template v-if="stepIndex === 3">
          <h3>
            Elige el método de pago que utilizaste e ingresa el comprobante de
            pago
          </h3>
          <Tabs default-value="recurrente" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="recurrente">
                A través de Recurrente
              </TabsTrigger>
              <TabsTrigger value="transfer">
                A través de Transferencia
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recurrente">
              <FormField name="link" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Link de Comprobante</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      :disabled="!!values.file"
                    />
                  </FormControl>
                  <FormDescription class="text-xs">
                    Ingresa el link del comprobante de pago exitoso.
                  </FormDescription>
                  <Alert v-if="values.file">
                    <Icon name="lucide:message-circle-warning" />
                    <!-- <AlertTitle>Heads up!</AlertTitle> -->
                    <AlertDescription>
                      Parece que ya has ingresado un archivo de comprobante, si
                      deseas ingresar un link, primero debes eliminar el
                      archivo.
                    </AlertDescription>
                  </Alert>

                  <FormMessage name="link" />
                </FormItem>
              </FormField>
            </TabsContent>
            <TabsContent value="transfer">
              <FormField
                name="file"
                v-slot="{
                  handleChange,
                  value,
                  handleBlur,
                  resetField,
                  handleReset,
                }"
              >
                <!-- TODO: cambiar el uso del input a controlado en lugar de no controlado, usando la data que devuelve el scoped slot -->
                <FormItem>
                  <FormLabel>Archivo de Comprobante</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      @change="handleChange"
                      @blur="handleBlur"
                      :disabled="!!values.link"
                    />
                    <template v-if="value">
                      <span class="text-sm text-muted-foreground font-semibold">
                        Archivo seleccionado:
                      </span>
                      <span class="text-sm text-muted-foreground">{{
                        value.name
                      }}</span>
                    </template>
                    <Button
                      v-if="value"
                      variant="destructive"
                      class="mt-2"
                      size="sm"
                      @click="
                        () => {
                          // resetField();
                          // handleReset();
                          // value = null;
                          handleChange(null);
                        }
                      "
                      type="button"
                    >
                      <Icon name="lucide:trash-2" />
                      Quitar archivo
                    </Button>
                  </FormControl>
                  <FormDescription class="text-xs">
                    Selecciona el comprobante de pago exitoso.
                  </FormDescription>
                  <Alert v-if="values.link">
                    <Icon name="lucide:message-circle-warning" />
                    <!-- <AlertTitle>Heads up!</AlertTitle> -->
                    <AlertDescription>
                      Parece que ya has ingresado un link de comprobante, si
                      deseas subir un archivo, primero debes eliminar el link.
                    </AlertDescription>
                  </Alert>
                  <FormMessage name="file" />
                </FormItem>
              </FormField>
            </TabsContent>
          </Tabs>
        </template>

        <template v-if="stepIndex === 4">
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
            <FormField v-slot="{ componentField, value }" name="link">
              <template v-if="value">
                <FormItem>
                  <FormLabel icon="lucide:link">Link de Comprobante</FormLabel>
                  <Input readonly type="text" v-bind="componentField" />
                </FormItem>
              </template>
            </FormField>
            <FormField v-slot="{ value }" name="file">
              <template v-if="value">
                <FormItem>
                  <FormLabel icon="lucide:file"
                    >Archivo de Comprobante</FormLabel
                  >
                  <Input readonly type="text" :default-value="value.name" />
                </FormItem>
              </template>
            </FormField>
            <FormField v-slot="{ value }" name="isAuthor">
              <FormItem class="flex items-center gap-2">
                <FormControl>
                  <Checkbox class="size-6" :default-value="value" disabled />
                </FormControl>
                <FormLabel class="cursor-pointer" icon="lucide:pencil-line"
                  >¿Eres autor de un trabajo de
                  investigacion/ponencia/taller?</FormLabel
                >
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
          disabled
        >
          Finalizar
          <Icon name="lucide:check" />
        </Button>
      </div>
    </Form>
  </div>
</template>
<script setup lang="ts">
  import { FormField, NuxtLink } from "#components";
  import { Button } from "@/components/ui/button";
  import { Form } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Stepper, StepperItem, StepperTitle } from "@/components/ui/stepper";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "vue-sonner";
  import * as z from "zod";
  import Alert from "~/components/ui/alert/Alert.vue";
  import AlertDescription from "~/components/ui/alert/AlertDescription.vue";
  import AlertTitle from "~/components/ui/alert/AlertTitle.vue";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
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
  import Tabs from "~/components/ui/tabs/Tabs.vue";
  import TabsContent from "~/components/ui/tabs/TabsContent.vue";
  import TabsList from "~/components/ui/tabs/TabsList.vue";
  import TabsTrigger from "~/components/ui/tabs/TabsTrigger.vue";
  import { createInscription } from "~/lib/api/inscriptions";

  import { callingCountries } from "country-data-list";

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
        identificationDocument: z
          .string({ message: "Campo requerido" })
          .min(5, "DPI o Pasaporte requerido"),
        areaCode: z
          .string({ message: "Campo requerido" })
          .min(1, "Debes seleccionar un código de área"),
        phone: z
          .string({ message: "Campo requerido" })
          .min(6, "Número inválido"),
        email: z
          .string({ message: "Campo requerido" })
          .email("Correo inválido"),
        organisation: z.string({ message: "Campo requerido" }).min(1),
        isAuthor: z.boolean().default(false),
        // link: z
        //   .string()
        //   .url("Debe ingresar un enlace válido al comprobante"),

      }),
    ),
    undefined, // Step 2 does not require validation
    toTypedSchema(
      z
        .object({
          link: z
            .string({ message: "Campo requerido" })
            .url("Debes ingresar un enlace válido al comprobante"),
        })
        .or(
          z.object({
            file: z
              .instanceof(File, {
                message: "Debes seleccionar un archivo de comprobante",
              })
              .refine((file) => file.size > 0, {
                message: "El archivo no puede estar vacío",
              }),
          }),
        ),
    ),
  ];
  const currentSchema = computed(() => {
    return schemas[stepIndex.value - 1];
  });

  const { mutate, asyncStatus } = useMutation({
    mutation: (values) => createInscription(values),
    onSuccess: () => {
      toast.success("¡Inscripción registrada exitosamente!");
      navigateTo("/inscripcion/exito");
    },

    onError: (error) => {
      toast.error("No hemos podido completar la inscripción:", {
        description: error.data?.message || error.name || "Error desconocido",
      });
    },
  });

  function handleNextStep(values) {
    if (stepIndex.value === 4) {
      const { link } = values;
      if (link) {
        values.paymentProof = {
          link,
        };
      }
      delete values.link;

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
