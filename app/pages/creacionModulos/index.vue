<template>
  <Alert v-if="showModuloError" variant="error" class="mb-4 flex items-start justify-between">
    <div class="flex items-center gap-2">
      <Icon name="lucide:alert-triangle" class="size-4 text-red-600" />
      <div>
        <AlertTitle class="font-semibold">Error</AlertTitle>
        <AlertDescription class="text-sm">
          {{ errorMessage }}
        </AlertDescription>
      </div>
    </div>
    <button aria-label="Cerrar alerta" @click="showModuloError = false" class="ml-4 text-red-600 hover:text-red-800"
      style="font-weight: bold;">
      ×
    </button>
  </Alert>

  <main class="grid place-items-center h-full">
    <div class="max-w-md w-full p-6">
      <div class="flex justify-center mb-2 text-primary text-4xl">
        <Icon name="lucide:building" />
      </div>

      <h1 class="text-2xl font-bold text-center mb-6">Crear Modulo</h1>
      <form @submit.prevent="crearModulo" class="space-y-6">
        <div class="space-y-2">
          <Label for="name">Nombre:</Label>
          <Input v-model="form.name" type="text" id="name" required />
        </div>

        <Button type="submit" class="w-full" :loading="asyncStatus.loading">
          <Icon name="lucide:shield-check" />
          Crear Modulo
        </Button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import Button from "~/components/ui/button/Button.vue";
import Input from "~/components/ui/input/Input.vue";
import Label from "~/components/ui/label/Label.vue";

import Alert from "~/components/ui/alert/Alert.vue";
import AlertTitle from "~/components/ui/alert/AlertTitle.vue";
import AlertDescription from "~/components/ui/alert/AlertDescription.vue";


import { useSessionStore } from "~/stores/session";
import { patchPassword } from "~/lib/api/inscriptions";
import { postSalones } from "~/lib/api/salones";
import { getModulos, postModules } from "~/lib/api/modules";

const sessionStore = useSessionStore();
const { loading } = storeToRefs(sessionStore);

const route = useRoute();
const id = route.params.id;

const form = ref({
  name: "",
});

const showModuloError = ref(false);
const errorMessage = ref("");



const { mutate, asyncStatus } = useMutation({
  mutation: (val) => postModules(val),
  onSuccess: (response) => {
    alert(response.message || "Modulo creado con éxito");
    form.value.name = "";
    form.value.moduleId = "";
  },
  onError: (error) => {
    errorMessage.value = error.data?.message || "Error al crear el modulo. Intenta de nuevo.";
    showModuloError.value = true;
  }
});

const crearModulo = () => {
  showModuloError.value = false;
  errorMessage.value = "";

  if (!form.value.name || form.value.name.trim().length === 0) {
    errorMessage.value = "El nombre es obligatorio.";
    showModuloError.value = true;
    return;
  }


  mutate({
    name: form.value.name,
  });
};
</script>

<style scoped></style>
