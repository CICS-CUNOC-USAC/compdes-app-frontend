<template>
  <div class="text-center h-svh px-6 bg-background" vaul-drawer-wrapper>
    <div class="flex gap-12 flex-col items-center justify-center h-full lg:grid lg:grid-cols-2 lg:gap-0">
      <section class="flex gap-7 flex-col items-center justify-center lg:border-r lg:border-neutral-200 lg:h-full">
        <!-- <img src="~/assets/svg/compdes-logo.svg" alt="COMPDES Logo" class="size-32 mx-auto" /> -->
        <CompdesIcon class="size-32 mx-auto fill-black dark:fill-white" />

        <h2 class="text-5xl text-foreground font-bold">
          <strong>COMPDES</strong>
          <span class="text-brand-green"> 2025</span>
        </h2>
        <p class="text-xl text-center text-muted-foreground">
          Ciencias de la Computación aplicadas a la Ingeniería
        </p>
      </section>

      <section class="flex flex-col gap-8 lg:gap-18 items-center justify-center">
        <section class="flex flex-col gap-8 lg:gap-4">
          <Button class="lg:text-lg lg:py-8" as-child>
              <Icon name="lucide:log-in" class="size-6" />
              Inscríbete ahora
          </Button>

          o

          <NuxtLink class="underline text-red-700" to="/login">
            Inicia Sesion
          </NuxtLink>
        </section>

        <div class="space-y-1">
          <p class="font-medium text-lg">¿Ya estás inscrito?</p>
          <NuxtLink class="text-brand-red hover:underline" to="/verificar-inscripcion">
            Comprueba el estado de tu inscripcion
          </NuxtLink>
          <p class="font-medium text-sm mt-4 max-w-80">Si usaste el antiguo formulario de Forms, no es necesario que
            vuelvas a inscribirte</p>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { NuxtLink } from "#components";
import CompdesIcon from "~/components/icons/CompdesIcon.vue";
import Button from "~/components/ui/button/Button.vue";
</script>
<style scoped></style>
