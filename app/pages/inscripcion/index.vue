<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Stepper,
    StepperDescription,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
  } from "@/components/ui/stepper";

  const stepIndex = ref(1);
  const steps = [
    {
      step: 1,
      title: "Your details",
      description: "Provide your name and email",
      icon: "lucide:user",
    },
    {
      step: 2,
      title: "Company details",
      description: "A few details about your company",
      icon: "lucide:wallet",
    },
    {
      step: 3,
      title: "Invite your team",
      description: "Start collaborating with your team",
      icon: "lucide:receipt",
    },
    {
      step: 4,
      title: "Invite your team",
      description: "Start collaborating with your team",
      icon: "lucide:users",
    },
  ];
</script>

<template>
  <Button
    variant="outline"
    class="mb-4"
    @click="() => stepIndex--"
    :disabled="stepIndex === 1"
  >
    Previous Step
  </Button>
  <Button
    variant="outline"
    class="mb-4"
    @click="() => stepIndex++"
    :disabled="stepIndex === steps.length"
  >
    Next Step
  </Button>
  <Stepper class="flex w-full items-start gap-2" v-model="stepIndex">
    <StepperItem
      v-for="step in steps"
      :key="step.step"
      v-slot="{ state }"
      class="relative flex w-full flex-col items-center justify-center"
      :step="step.step"
    >
      <StepperSeparator
        v-if="step.step !== steps[steps.length - 1].step"
        class="absolute left-[calc(50%+40px)] right-[calc(-50%+30px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
      />

      <div
        class="z-10 rounded-full shrink-0 p-2"
        :class="[
          state === 'active' &&
            'outline-2 outline-ring outline-offset-2',
        ]"
        @click="() => undefined"
      >
        <Icon name="lucide:check" v-if="state === 'completed'" />
        <!-- <Icon name="lucide:circle" v-if="state === 'active'" /> -->
        <Icon :name="step.icon" v-else />
        <!-- <Icon name="lucide:dot" v-if="state === 'inactive'" /> -->
      </div>

      <!-- <div class="mt-5 flex flex-col items-center text-center">
        <StepperTitle
          :class="[state === 'active' && 'text-primary']"
          class="text-sm font-semibold transition lg:text-base"
        >
          {{ step.title }}
        </StepperTitle>
        <StepperDescription
          :class="[state === 'active' && 'text-primary']"
          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
        >
          {{ step.description }}
        </StepperDescription>
      </div> -->
    </StepperItem>
  </Stepper>
</template>
