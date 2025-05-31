<template>
  <Form :validation-schema="formSchema" @submit="onSubmit">
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
    <div class="flex flex-col gap-4 mt-16 items-center min-w-screen p-2">
      <template v-if="stepIndex === 1">
        <div class="flex flex-row px-2 gap-x-2">
          <FormField v-slot="{ componentField }" name="firstName">
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastName">
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <FormField v-slot="{ componentField }" name="id">
          <FormItem>
            <FormLabel>Numero de Identificacion (DPI o Pasaporte)</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormDescription class="text-xs">
              *DPI solo valido para nacionales Guatemaltecos
            </FormDescription>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel>Telefono</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Correo Electronico</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="university">
          <FormItem>
            <FormLabel>Universidad</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="truncate max-w-full">
                  <SelectValue placeholder="Selecciona una universidad" class="max-w-[80vw] truncate" />
                </SelectTrigger>
                <SelectContent class="max-w-[95vw]">
                  <SelectGroup>
                    <SelectLabel>Red Compdes</SelectLabel>
                    <SelectItem v-for="uni in compdesU" :key="uni" :value="uni" class="whitespace-normal break-words">
                      {{ uni }}
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Guatemala</SelectLabel>
                    <SelectItem v-for="uni in guatemalaU" :key="uni" :value="uni">
                      {{ uni }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </template>


      <template v-if="stepIndex === 2">
        <div class="px-4 text-gray-800">
          <p class="text-base font-medium">
            Puedes realizar el pago con tu tarjeta de
            <span class="font-bold text-brand-red">Débito o Crédito VISA, MASTERCARD</span>
            por un monto de <span class="font-semibold">$45.00</span>.
            <br />
            <span class="text-sm text-muted-foreground">(No se aceptan transferencias)</span>
          </p>

          <ol class="list-decimal space-y-2 text-sm leading-relaxed">
            <li>Ingresa tu nombre completo.</li>
            <li>Ingresa tu correo electrónico.</li>
            <li>Llena el formulario de pago con los datos de tu tarjeta.</li>
            <li>Elige el país al que pertenece tu tarjeta.</li>
            <li>Procede con el pago.</li>
            <li>Guarda el link de tu pago exitoso en la opcion 'Compartir Comprobante'.</li>
            <li>Recibirás un mensaje de confirmación en tu correo.</li>
            <li>Ingresa el link del comprobante en el siguiente paso.</li>
          </ol>

          <Button as-child class="self-center">
            <NuxtLink to="https://app.recurrente.com/checkout-session/ch_gzv3nkfdre74yqqq" class="text-center mt-2"
              target="_blank">
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
    <div class="absolute bottom-12 left-0 w-full grid grid-cols-2">
      <Button variant="outline" class="rounded-none" @click="() => stepIndex--" :disabled="stepIndex === 1"
        type="button">
        Anterior
      </Button>
      <Button variant="outline" class="rounded-none" @click="() => stepIndex++" v-if="stepIndex !== steps.length"
        type="button">
        Siguiente
      </Button>
      <Button as-child variant="outline" class="rounded-none" v-else type="button">
        <NuxtLink to="https://app.recurrente.com/checkout-session/ch_gzv3nkfdre74yqqq" class="text-center"
          target="_blank">
          Finalizar Inscripcion
        </NuxtLink>
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
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import FormControl from "~/components/ui/form/FormControl.vue";
import FormItem from "~/components/ui/form/FormItem.vue";
import FormLabel from "~/components/ui/form/FormLabel.vue";
import FormDescription from "~/components/ui/form/FormDescription.vue";
import { useForm } from "vee-validate";
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import Select from "~/components/ui/select/Select.vue";
import SelectTrigger from "~/components/ui/select/SelectTrigger.vue";
import SelectValue from "~/components/ui/select/SelectValue.vue";
import SelectContent from "~/components/ui/select/SelectContent.vue";
import SelectGroup from "~/components/ui/select/SelectGroup.vue";
import SelectLabel from "~/components/ui/select/SelectLabel.vue";
import SelectItem from "~/components/ui/select/SelectItem.vue";

const formSchema = toTypedSchema(z.object({
  firstName: z.string().min(1, "Nombre requerido").max(50),
  lastName: z.string().min(1, "Apellido requerido").max(50),
  id: z.string().min(5, "Debe ingresar un ID válido"),
  phone: z.string().min(6, "Número inválido"),
  email: z.string().email("Correo inválido"),
  university: z.string().min(1, "Universidad requerida"),
  receiptUrl: z.string().url("Debe ingresar un enlace válido al comprobante"),
}))

const form = useForm({
  validationSchema: formSchema,
})

function onSubmit(values: any) {
  console.log('Form submitted!', values)
}

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

const compdesU = [
  "Bluefields Indian and Caribbean University (BICU).",
  "Instituto Tecnológico de Costa Rica - Sede San Carlos (ITCR-SSC).",
  "Universidad de Alcalá (UAH).",
  "Universidad de El Salvador (UES).",
  "Universidad de las Regiones Autónomas de la Costa Caribe Nicaragüense (URACCAN).",
  "Universidad de San Carlos de Guatemala - Centro Universitario de Occidente (CUNOC-USAC).",
  "Universidad Nacional Autonoma de Honduras (UNAH).",
  "Universidad Nacional Autonoma de Nicaragua - León (UNAN-León).",
  "Universidad Nacional Autonoma de Nicaragua - Managua (UNAN-Managua).",
  "Universidad Nacional de Ingenierí��a (Nicaragua) (UNI).",
  "Universidad de Costa Rica (UCR)."
]

const guatemalaU = [
  "Universidad Mariano Gálvez.",
  "Universidad Mesoamericana.",
  "Universidad Regional de Guatemala.",
  "Universidad Da Vinci.",
  "Universidad Rural de Guatemala.",
  "Universidad Rafael Landivar.",
  "Universidad Galileo.",
  "Universidad Panamericana.",
  "Universidad de Occidente."
]
</script>
