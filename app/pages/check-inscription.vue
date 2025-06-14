<template>
  <div class="h-full p-6 flex flex-col items-center justify-center">
    <section class="max-w-md space-y-6">
      <h1 class="text-2xl font-bold text-center">Revisar inscripción</h1>
      <p class="text-center text-muted-foreground"> 
        Ingresa tu número de identificación personal (pasaporte o identificación
        nacional) que utilizaste al momento de inscribirte para verificar el
        estado de tu inscripción.
      </p>
      <form>
        <Label icon="lucide:id-card" for="identification">
          Número de identificación
        </Label>
        <Input
          id="identification"
          type="text"
          placeholder="1234567890"
          class="mt-2 mb-4"
          required
        />

        <Button
          type="submit"
          class="w-full mt-2"
        >
          <Icon name="lucide:badge-check" class="mr-2" />
          Comprobar
        </Button>
      </form>
    </section>
  </div>
</template>
<script setup>
  import Button from "~/components/ui/button/Button.vue";
import Input from "~/components/ui/input/Input.vue";
  import Label from "~/components/ui/label/Label.vue";
</script>
<style scoped></style>
