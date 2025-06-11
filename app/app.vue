<script setup lang="ts">
  import "vue-sonner/style.css";
  import { Toaster } from "./components/ui/sonner";
</script>

<template>
  <Toaster
    position="top-center"
    :toast-options="{
      duration: 5000,
      classes: {
        toast: 'font-sans',
      },
    }"
  />
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>
