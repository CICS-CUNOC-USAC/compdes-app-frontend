<template>
  <div class="container mx-auto h-full pt-5 px-5">
    <div class="flex flex-col h-full">
      <div class="">
        <Button as-child size="sm" variant="link" class="mb-3">
          <NuxtLink to="/admin/conferences">
            <Icon name="lucide:arrow-left" />
            Volver a Conferencias
          </NuxtLink>
        </Button>
        <Button as-child size="sm" variant="link" class="mb-3">
          <NuxtLink to="/admin/home">
            <Icon name="lucide:house" />
            Volver a Inicio
          </NuxtLink>
        </Button>

        <h1 class="text-2xl font-bold">Crear Conferencia</h1>
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
        :initial-values="formData"
        keep-values
        class="flex flex-col flex-1 pt-6"
      >
        <div
          class="flex-1 overflow-auto self-center w-full max-w-xl px-4 pt-20"
        >
          <template v-if="stepIndex === 1">
            <fieldset class="gap-4 grid grid-cols-1">
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel icon="lucide:monitor-play">Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="name" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="description">
                <FormItem>
                  <FormLabel icon="lucide:file-text"> Descripcion </FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage name="description" />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="type">
                <FormItem>
                  <FormLabel icon="lucide:mic-vocal"
                    >Tipo de Presentacion</FormLabel
                  >

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
                                "Selecciona un tipo de presentacion..."
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
                          placeholder="Buscar tipo..."
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
                        v-for="group in presentationTypeList"
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
                  <FormMessage name="type" />
                </FormItem>
              </FormField>
            </fieldset>
          </template>
          <template v-if="stepIndex === 2">
            <fieldset class="gap-4 grid grid-cols-1">
              <FormField v-slot="{ componentField }" name="initScheduledDate">
                <FormItem>
                  <FormLabel icon="lucide:calendar-clock"
                    >Fecha y Hora Inicio</FormLabel
                  >
                  <FormControl>
                    <Datepicker
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField.onChange"
                      :enable-time-picker="true"
                      :minute-increment="5"
                      locale="es"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="Selecciona fecha y hora"
                      auto-apply
                      class="w-full rounded-lg"
                    />
                  </FormControl>
                  <FormMessage name="initScheduledDate" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="endScheduledDate">
                <FormItem>
                  <FormLabel icon="lucide:calendar-clock"
                    >Fecha y Hora Final</FormLabel
                  >
                  <FormControl>
                    <Datepicker
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField.onChange"
                      :enable-time-picker="true"
                      :minute-increment="5"
                      locale="es"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="Selecciona fecha y hora"
                      auto-apply
                      class="w-full rounded-lg"
                    />
                  </FormControl>
                  <FormMessage name="endScheduledDate" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="classroomId">
                <FormItem>
                  <FormLabel icon="lucide:mic-vocal">Salón</FormLabel>

                  <Combobox by="label" v-bind="componentField">
                    <FormControl>
                      <ComboboxAnchor as-child>
                        <ComboboxTrigger as-child>
                          <Button
                            variant="outline"
                            class="justify-between rounded-md py-2.5 min-w-full max-w-full"
                          >
                            <span class="truncate font-normal">
                              {{
                                componentField.modelValue ??
                                "Selecciona un salón..."
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
                          placeholder="Buscar salón..."
                          :autoFocus="false"
                        />
                        <span
                          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                        >
                          <Icon
                            name="lucide:search"
                            class="h-4 w-4 opacity-50"
                          />
                        </span>
                      </div>

                      <ComboboxEmpty class="w-full">
                        No se encontraron resultados.
                      </ComboboxEmpty>

                      <ComboboxGroup heading="Salones disponibles">
                        <ComboboxItem
                          v-for="salon in salones"
                          :key="salon.id"
                          :value="salon.id"
                          class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold"
                        >
                          <ComboboxItemIndicator>
                            <Icon name="lucide:check" class="size-4" />
                          </ComboboxItemIndicator>
                          {{ salon.name }}
                        </ComboboxItem>
                      </ComboboxGroup>
                    </ComboboxList>
                  </Combobox>
                  <FormMessage name="classroomId" />
                </FormItem>
              </FormField>
            </fieldset>
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
  </div>
</template>
<script setup lang="ts">
  import { FormField, NuxtLink } from "#components";
  import { Button } from "@/components/ui/button";
  import { Form } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Stepper, StepperItem, StepperTitle } from "@/components/ui/stepper";
  import { toTypedSchema } from "@vee-validate/zod";
  import Datepicker from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  import { reactive } from "vue";
  import { useRouter } from "vue-router";
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
  import FormItem from "~/components/ui/form/FormItem.vue";
  import FormLabel from "~/components/ui/form/FormLabel.vue";
  import { ref } from "vue";
  import { postConferencias } from "~/lib/api/conferencias";
  import { getSalones } from "~/lib/api/salones";

  const router = useRouter();

  const formData = reactive({
    name: "",
    description: "",
    type: "",
    initScheduledDate: "",
    endScheduledDate: "",
    classroomId: "",
  });

  const { data: salones } = await useAsyncData(() => getSalones());

  const stepIndex = ref(1);
  const schemas = [
    toTypedSchema(
      z.object({
        name: z
          .string({ message: "Campo requerido" })
          .min(1, "El nombre debe contener al menos 1 caracter")
          .max(100),
        description: z
          .string({ message: "Campo requerido" })
          .min(1, "La descripcion debe contener al menos 1 caracter")
          .max(500),
        type: z.string({ message: "Campo requerido" }).min(1),
      }),
    ),
    toTypedSchema(
      z.object({
        initScheduledDate: z.preprocess((arg) => {
          if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
          }
          return undefined;
        }, z.date({ required_error: "La fecha de inicio es obligatoria", invalid_type_error: "La fecha debe ser válida" })),
        endScheduledDate: z.preprocess((arg) => {
          if (typeof arg === "string" || arg instanceof Date) {
            const date = new Date(arg);
            return isNaN(date.getTime()) ? undefined : date;
          }
          return undefined;
        }, z.date({ required_error: "La fecha de finalización es obligatoria", invalid_type_error: "La fecha debe ser válida" })),
        classroomId: z.string({ message: "El salón es obligatorio" }).min(1),
      }),
    ),
  ];
  const currentSchema = computed(() => {
    return schemas[stepIndex.value - 1];
  });

  const errorMessage = ref("");
  const showError = ref(false);

  const { mutate, asyncStatus } = useMutation({
    mutation: (val: {
      name: string;
      description: string;
      type: string;
      initScheduledDate: string;
      endScheduledDate: string;
      classroomId: string;
    }) => postConferencias(val),
    onSuccess: (response) => {
      const res = response as { message?: string };
      alert(res.message || "Conferencia creada con éxito");
      formData.name = "";
      formData.description = "";
      formData.type = "";
      formData.initScheduledDate = "";
      formData.endScheduledDate = "";
      formData.classroomId = "";
      showError.value = false;
    },
    onError: (error) => {
      errorMessage.value =
        error?.message || "Error al crear la conferencia. Intenta de nuevo.";
      showError.value = true;
    },
  });

  function handleNextStep(values: any) {
    console.log("Paso actual:", stepIndex.value);
    console.log("Valores recibidos:", values);

    Object.assign(formData, values);

    // El paso final ya validó y ahora puede enviar
    if (stepIndex.value >= steps.length) {
      console.log("Enviando datos finales:", JSON.stringify(formData, null, 2));
      mutate(formData);
      return;
    }

    // Avanza al siguiente paso
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
      title: "Datos de la Conferencia",
      description: "Provide the conference details",
      icon: "lucide:projector",
    },
    {
      step: 2,
      title: "Fecha y Lugar",
      description: "Provide the date and location of the conference",
      icon: "lucide:calendar-days",
    },
  ];

  definePageMeta({
    layout: "admin",
    title: "Crear Conferencia",
  });
</script>
