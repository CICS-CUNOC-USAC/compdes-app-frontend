<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "./components/ui/sonner";
import { ConfigProvider } from "reka-ui";
const myUseId = () => useId();
</script>

<template>
  <Toaster position="top-center" :toast-options="{
    duration: 5000,
    classes: {
      toast: 'font-sans',
      description: '!text-muted-foreground',
    },
  }" />
  <ConfigProvider :use-id="myUseId">

    <NuxtLayout>
      <slot />
    </NuxtLayout>
  </ConfigProvider>
</template>
<style>
html {
  scrollbar-gutter: stable;
}
</style>
