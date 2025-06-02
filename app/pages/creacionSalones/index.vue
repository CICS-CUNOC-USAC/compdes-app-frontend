<template>
  <Form :validation-schema="formSchema" @submit="onSubmit">

    <div class="mb-6">
      <Button variant="outline" class="flex items-center ml-8" @click="volver" type="button">
        <Icon name="lucide:arrow-left" class="mr-2" />
        Volver
      </Button>
    </div>


    <Stepper class="flex w-full items-start gap-2 relative lg:-ml-90" v-model="stepIndex">

      <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
        class="flex w-full flex-col items-center justify-center" :step="step.step">
        <StepperSeparator v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(0%+40px)] right-[calc(-0%+30px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

        <div class="z-10 rounded-full shrink-0 p-2"
          :class="[state === 'active' && 'outline-2 outline-ring outline-offset-2']" @click="() => undefined">
          <Icon name="lucide:check" v-if="state === 'completed'" />
          <Icon :name="step.icon" v-else />
        </div>

        <StepperTitle :class="[state === 'active' && 'text-primary']"
          class="absolute top-full mt-4 w-max -translate-x-1/2 left-1/2 text-xl font-semibold transition lg:text-base"
          v-if="state === 'active'">
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
      <!-- Botón Anterior: solo visible si hay más de un paso -->
      <Button v-if="steps.length > 1" variant="outline" class="rounded-none" @click="() => stepIndex--"
        :disabled="stepIndex === 1" type="button">
        Anterior
      </Button>

      <Button variant="outline" class="rounded-none" @click="() => stepIndex++" v-if="stepIndex !== steps.length"
        type="button">
        Siguiente
      </Button>

      <!-- Botón Guardar: ocupa ambas columnas si es el único visible -->
      <Button variant="outline" class="rounded-none text-left lg:ml-50" v-else
        :class="steps.length === 1 ? 'col-span-2' : ''" type="submit">
        Guardar Salón
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { FormField, NuxtLink } from "#components";
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
import { useForm } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useRouter } from 'vue-router'

const router = useRouter()

function volver() {
  router.back() // o router.push('/listadoSalones') 
}

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Nombre del salón requerido").max(50),
    location: z.string().min(1, "Ubicación del salón requerida").max(50),
    space: z.string().max(10).optional(), // No obligatorio
  })
);

const form = useForm({
  validationSchema: formSchema,
});

function onSubmit(values: any) {
  console.log("Datos:", values);
}

// Lógica para guardar salón
/*async function onSubmit(values: any) {
  try {
    const response = await fetch("/ruta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la creación:", errorData);
      return;
    }

    const result = await response.json();
    console.log("Salón creado:", result);

  } catch (error) {
    console.error("Error al crear el salón:", error);
  }
}*/

const stepIndex = ref(1);
const steps = [
  {
    step: 1,
    title: "Datos Salones",
    description: "Provide the necessary information to create your exhibition hall.",
    icon: "lucide:presentation",
  },
];
</script>
