<template>
  <main class="grid place-items-center h-full">
    <div class="max-w-md w-full p-6">
      <div class="flex justify-center mb-2 text-primary text-4xl">
        <Icon name="lucide:lock" />
      </div>

      <h1 class="text-2xl font-bold text-center mb-6">Crear Contraseña</h1>
      <form @submit.prevent="crearPassword" class="space-y-6">
        <div class="space-y-2">
          <Label for="identificationDocument">Documento de Identificación:</Label>
          <Input v-model="form.identificationDocument" type="text" id="identificationDocument" required />
        </div>

        <div class="space-y-2 relative">
          <Label for="password">Contraseña:</Label>
          <Input :type="showPassword ? 'text' : 'password'" v-model="form.password" id="password" required />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-3 top-9 text-gray-500 hover:text-gray-700" aria-label="Mostrar u ocultar contraseña">
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="size-5" />
          </button>
        </div>

        <div class="space-y-2 relative">
          <Label for="confirmPassword">Confirmar Contraseña:</Label>
          <Input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" id="confirmPassword"
            required />
          <button type="button" @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            aria-label="Mostrar u ocultar confirmar contraseña">
            <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="size-5" />
          </button>
        </div>

        <Button type="submit" class="w-full" :loading="asyncStatus.loading">
          <Icon name="lucide:shield-check" />
          Crear Contraseña
        </Button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { toast } from "vue-sonner";
import { ref } from "vue";
import Button from "~/components/ui/button/Button.vue";
import Input from "~/components/ui/input/Input.vue";
import Label from "~/components/ui/label/Label.vue";

import Alert from "~/components/ui/alert/Alert.vue";
import AlertTitle from "~/components/ui/alert/AlertTitle.vue";
import AlertDescription from "~/components/ui/alert/AlertDescription.vue";


import { useSessionStore } from "~/stores/session";
import { patchPassword } from "~/lib/api/inscriptions";

const sessionStore = useSessionStore();
const { loading } = storeToRefs(sessionStore);

const route = useRoute();
const id = route.params.id;

const form = ref({
  identificationDocument: "",
  password: "",
  confirmPassword: "",
});

const showPasswordError = ref(false);
const errorMessage = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { mutate, asyncStatus } = useMutation({
  mutation: (val) => patchPassword(val, id),
  onSuccess: (response) => {
    toast.success(response.message || "Contraseña creada con éxito");
    form.value.password = "";
    form.value.confirmPassword = "";
    showPasswordError.value = false;
  },
  onError: (error) => {
    toast.error(error.data?.message || "Error al crear la contraseña. Intenta de nuevo.");
    showPasswordError.value = true;
  }
});


const crearPassword = () => {
  showPasswordError.value = false;
  errorMessage.value = "";

  if (form.value.password.length < 8) {
    toast.error("La contraseña debe tener al menos 8 caracteres.");
    showPasswordError.value = true;
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    toast.error("Las contraseñas no coinciden. Por favor, vuelve a intentarlo.");
    showPasswordError.value = true;
    return;
  }

  mutate({
    username: "123",
    identificationDocument: form.value.identificationDocument,
    password: form.value.password,
  });
};
</script>

<style scoped></style>
