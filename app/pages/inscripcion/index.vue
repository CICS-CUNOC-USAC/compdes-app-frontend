<template>
  <Form >
    <Stepper class="flex w-full items-start gap-2 relative" v-model="stepIndex">
      <StepperItem v-for="step in steps" :key="step.step" v-slot="{ state }"
        class="flex w-full flex-col items-center justify-center" :step="step.step">
        <StepperSeparator v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[calc(0%+40px)] right-[calc(-0%+30px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary" />

        <div class="z-10 rounded-full shrink-0 p-2" :class="[
          state === 'active' &&
          'outline-2 outline-ring outline-offset-2',
        ]" @click="() => undefined">
          <Icon name="lucide:check" v-if="state === 'completed'" />
          <Icon :name="step.icon" v-else />
        </div>

        <StepperTitle :class="[state === 'active' && 'text-primary']"
          class="absolute top-full mt-4 w-max -translate-x-1/2 left-1/2 text-xl font-semibold transition lg:text-base"
          v-if="state === 'active'">
          {{ step.title }}
        </StepperTitle>
        <!-- 
      <div class="mt-5 flex flex-col items-center text-center">
        <StepperDescription :class="[state === 'active' && 'text-primary']"
          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
          {{ step.description }}
        </StepperDescription>
      </div>
-->
      </StepperItem>
    </Stepper>
    <div class="flex flex-col gap-4 mt-16 items-center min-w-2xl">
      <template v-if="stepIndex === 1">
        <div class="flex flex-row px-2 gap-x-2">
          <FormField name="firstName">
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="text" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="lastName">
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input type="text" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <FormField name="id">
          <FormItem>
            <FormLabel>ID</FormLabel>
            <FormControl>
              <Input type="text" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="phone">
          <FormItem>
            <FormLabel>Telefono</FormLabel>
            <FormControl>
              <Input type="text" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="email">
          <FormItem>
            <FormLabel>Correo Electronico</FormLabel>
            <FormControl>
              <Input type="text" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="university">
          <FormItem>
            <FormLabel>Universidad</FormLabel>
            <FormControl>
              <Input type="text" />
            </FormControl>
          </FormItem>
        </FormField>
      </template>

      <template v-if="stepIndex === 2">
        <h1>Lorem ipsum instruccion</h1>
      </template>

      <template v-if="stepIndex === 3">
        <h1>Link de Pago</h1>
      </template>

      <template v-if="stepIndex === 4">
        <h1>Nombre</h1>
        <h1>Apellido</h1>
        <h1>ID</h1>
        <h1>Telefono</h1>
        <h1>Correo Electronico</h1>
        <h1>Universidad</h1>
      </template>
    </div>
    <div class="absolute bottom-12 left-0 w-full grid grid-cols-2">
      <Button variant="outline" class="rounded-none" @click="() => stepIndex--" :disabled="stepIndex === 1" type="button">
        Anterior
      </Button>
      <Button variant="outline" class="rounded-none" @click="() => stepIndex++" :disabled="stepIndex === steps.length" type="button">
        Siguiente
      </Button>
    </div>
  </Form>
</template>
<script setup lang="ts">
import { FormField } from "#components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import FormControl from "~/components/ui/form/FormControl.vue";
import FormItem from "~/components/ui/form/FormItem.vue";
import FormLabel from "~/components/ui/form/FormLabel.vue";

const stepIndex = ref(1);
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
