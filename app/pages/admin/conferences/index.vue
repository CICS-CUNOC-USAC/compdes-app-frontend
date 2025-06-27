<template>
  <div class="container mx-auto p-5">
    <div class="mb-3">
      <Button as-child size="sm" variant="link">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:arrow-left" />
          Volver a Inicio
        </NuxtLink>
      </Button>
    </div>

     <div
      class="flex justify-between flex-col lg:flex-row lg:items-center gap-3 mb-6"
    >
      <h1 class="text-2xl font-bold">Listado de Conferencias</h1>

      <div class="space-x-2 space-y-2">
        <Button size="icon" variant="outline" @click="">
          <Icon name="lucide:refresh-ccw" />
        </Button>
        <Button size="sm" as-child>
          <NuxtLink to="/admin/conferences/new">
            <Icon name="lucide:plus" />
            Crear Conferencia
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
definePageMeta({
  title: "Listado de Conferencias",
  layout: "admin",
  });
</script>
<style scoped>
</style>