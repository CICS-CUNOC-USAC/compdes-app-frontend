<template>
  <Form
    :validation-schema="formSchema"
    :initial-values="initialValues"
    @submit="onSubmit"
    v-slot="{ handleSubmit, resetForm }"
  >
    <template v-if="!resetFormFn">
      <div v-if="false">{{ (() => resetFormFn = resetForm)() }}</div>
    </template>

    <Stepper class="flex w-full items-start gap-2 relative lg:-ml-90" v-model="stepIndex">
      <StepperItem
        v-for="step in steps"
        :key="step.step"
        v-slot="{ state }"
        class="flex w-full flex-col items-center justify-center"
        :step="step.step"
      >
        <StepperSeparator
          v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(0%+40px)] right-[calc(-0%+30px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
        />

        <div
          class="z-10 rounded-full shrink-0 p-2"
          :class="[state === 'active' && 'outline-2 outline-ring outline-offset-2']"
        >
          <Icon name="lucide:check" v-if="state === 'completed'" />
          <Icon :name="step.icon" v-else />
        </div>

        <StepperTitle
          :class="[state === 'active' && 'text-primary']"
          class="absolute top-full mt-4 w-max -translate-x-1/2 left-1/2 text-xl font-semibold transition lg:text-base"
          v-if="state === 'active'"
        >
          {{ step.title }}
        </StepperTitle>
      </StepperItem>
    </Stepper>

    <div class="flex flex-col gap-8 mt-16 items-start min-w-screen p-2 lg:ml-100">
      <template v-if="stepIndex === 1">
        <div class="w-full max-w-2xl px-2 flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="location">
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="space">
            <FormItem>
              <FormLabel>Capacidad</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </template>
    </div>

    <div class="absolute bottom-12 left-0 w-full grid grid-cols-2 gap-px">
      <Button
        v-if="steps.length > 1"
        variant="outline"
        class="rounded-none"
        @click="() => stepIndex--"
        :disabled="stepIndex === 1"
        type="button"
      >
        Anterior
      </Button>

      <Button
        variant="outline"
        class="rounded-none"
        @click="() => stepIndex++"
        v-if="stepIndex !== steps.length"
        type="button"
      >
        Siguiente
      </Button>

      <Button
        variant="outline"
        class="rounded-none text-left lg:ml-50"
        v-else
        :class="steps.length === 1 ? 'col-span-2' : ''"
        @click="handleSubmit(onSubmit)"
      >
        Actualizar Salón
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import {
  Stepper,
  StepperItem,
  StepperSeparator,
  StepperTitle,
} from "@/components/ui/stepper";
import FormControl from "~/components/ui/form/FormControl.vue";
import FormItem from "~/components/ui/form/FormItem.vue";
import FormLabel from "~/components/ui/form/FormLabel.vue";
import { FormField } from "#components";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Nombre del salón requerido").max(50),
    location: z.string().min(1, "Ubicación del salón requerida").max(50),
    space: z.string().max(10).optional(),
  })
);

const stepIndex = ref(1);

const steps = [
  {
    step: 1,
    title: "Datos Salones",
    icon: "lucide:presentation",
  },
];

const initialValues = ref({
  name: "",
  location: "",
  space: "",
});

const route = useRoute();
const id = route.params.id;
console.log("ID recibido:", id);

let resetFormFn: any = null;

onMounted(() => {
  if (id) {
    loadSalonData();
  }
});

async function loadSalonData() {
  // Aquí llamada a la API:
  // const response = await fetch(`endpoint`);
  // const data = await response.json();

  /*initialValues.value = { ...data };

  if (resetFormFn) {
    resetFormFn({ values: data });
  }*/
}

function onSubmit(values: any) {
  console.log("Datos enviados para editar:", values);
}

/*async function onSubmit(values: any) {
  try {
    const response = await fetch(`endpoint`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al actualizar:", errorData);
      return;
    }

    const result = await response.json();
    console.log("Salón actualizado:", result);
  } catch (error) {
    console.error("Error al actualizar el salón:", error);
  }
}*/

</script>
