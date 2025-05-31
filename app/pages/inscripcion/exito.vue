<template>
  <div class="flex flex-col min-h-screen items-center justify-center space-y-8 px-4 text-center">
    <div class="rounded-xl border align-middle border-black/80 p-6 text-xl shadow">
      <Icon name="lucide:check" />
    </div>

    <h1 class="text-2xl font-bold">Gracias por Inscribirte!</h1>

    <p class="max-w-md text-lg leading-relaxed">
      Tu inscripción está siendo verificada. Te enviaremos un correo cuando sea aprobada.
    </p>

    <NuxtLink to="/" class="text-base font-semibold text-black underline transition hover:text-brand-red">
      Volver al Inicio
    </NuxtLink>
  </div>
</template>
