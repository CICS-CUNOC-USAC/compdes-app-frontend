<template>
  <div class="flex min-h-screen flex-col items-center justify-center space-y-8 px-4 text-center font-handwritten my-auto">
    <!-- Ícono de Check -->
    <div class="rounded-xl border border-black/80 bg-[url('/crosshatch.svg')] p-6 text-xl shadow">
      <Icon name="lucide:check" />
    </div>

    <!-- Mensaje de agradecimiento -->
    <h1 class="text-2xl font-bold">Gracias por Inscribirte!</h1>

    <!-- Texto de verificación -->
    <p class="max-w-md text-lg leading-relaxed">
      Tu inscripción está siendo verificada. Te enviaremos un correo cuando sea aprobada.
    </p>

    <!-- Botón de regreso -->
    <NuxtLink
      to="/"
      class="text-base font-semibold text-black underline transition hover:text-brand-red"
    >
      Volver al Inicio
    </NuxtLink>
  </div>
</template>
