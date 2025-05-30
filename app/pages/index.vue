<template>
  <div class="text-center h-dvh px-6 bg-white" vaul-drawer-wrapper>
    <div class="flex gap-12 flex-col items-center justify-center h-full lg:grid lg:grid-cols-2 lg:gap-0">
      <section class="flex gap-7 flex-col items-center justify-center lg:border-r lg:border-neutral-200 lg:h-full">
        <img src="~/assets/svg/compdes-logo.svg" alt="COMPDES Logo" class="size-32 mx-auto" />

        <h2 class="text-5xl text-neutral-700 font-bold">
          <strong>COMPDES</strong>
          <span class="text-brand-green"> 2025</span>
        </h2>
        <p class="text-xl text-center text-neutral-600">
          Ciencias de la Computación aplicadas a la Ingeniería
        </p>
      </section>

      <section class="flex flex-col gap-8 lg:gap-18 items-center justify-center">
        <Button class="lg:text-lg lg:py-8">
          <NuxtLink to="inscripcion">
            <div class="flex flex-row gap-x-2">
              <Icon name="lucide:log-in" />
              <p>
                Inscríbete ahora
              </p>
            </div>
          </NuxtLink>
        </Button>

        <div class="space-y-1">
          <p class="font-medium text-lg">¿Ya estás inscrito?</p>
          <NuxtLink class="text-brand-red hover:underline" to="/check-inscription">
            Comprueba el estado de tu inscripcion
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { NuxtLink } from "#components";
import Button from "~/components/ui/button/Button.vue";
</script>
<style scoped></style>
