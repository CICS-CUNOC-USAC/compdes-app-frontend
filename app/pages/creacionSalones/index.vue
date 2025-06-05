<template>
  <!-- <button
  @click="() => stepIndex++"
  >
    test
  </button> -->

  <div class="mb-6">
    <Button variant="outline" class="flex items-center ml-8" @click="volver" type="button">
      <Icon name="lucide:arrow-left" class="mr-2" />
      Volver
    </Button>
  </div>

  <div class="flex flex-col h-full pt-4">
    <Stepper class="flex w-full items-start gap-2 relative" v-model="stepIndex">
      <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
        class="flex w-full flex-col items-center justify-center" :step="step.step">
        <!-- <StepperSeparator
          v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
        /> -->

        <div class="z-10 rounded-full shrink-0 p-2" :class="[
          state === 'active' && 'outline-2 outline-ring outline-offset-2',
        ]" @click="() => undefined">
          <Icon name="lucide:check" v-if="state === 'completed'" />
          <Icon :name="step.icon" v-else />
        </div>

        <StepperTitle :class="[state === 'active' && 'text-primary']"
          class="absolute top-full mt-4 w-max -translate-x-1/2 left-1/2 text-xl font-semibold"
          v-if="state === 'active'">
          {{ step.title }}
        </StepperTitle>
      </StepperItem>
    </Stepper>
    <!-- <div class="flex flex-col gap-4 mt-16 items-center w-full p-2 flex-1"> -->
    <Form Form :validation-schema="formSchema" @submit="onSubmit" keep-values class="flex flex-col flex-1 pt-6">
      <div class="flex-1 overflow-auto self-center w-full max-w-xl px-1 pt-20">
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
            <div class="w-full sticky bottom-0 bg-background flex justify-end px-4 py-3 pt-20"
              v-if="stepIndex === steps.length">
              <Button variant="outline" class="rounded-none" type="submit">
                Guardar Salón
              </Button>
            </div>
          </div>
        </template>
      </div>

    </Form>
    <!-- </div> -->
  </div>
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
