<template>
  <main class="grid place-items-center h-full">
    <div class="max-w-md w-full p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
      <form @submit.prevent="login(credentials)" class="space-y-6">
        <div class="space-y-2">
          <Label for="username">Nombre de usuario:</Label>
          <Input v-model="credentials.username" type="text" id="username" required />
        </div>
        <div class="space-y-2">
          <Label for="password">Contraseña:</Label>
          <div class="relative w-full">
            <Input v-model="credentials.password" type="password" id="password" required />
          </div>
        </div>
        <Button type="submit" class="w-full" :loading>
          <Icon name="lucide:log-in" />
          Login</Button
        >
      </form>
    </div>
  </main>
</template>
<script setup>
  import Button from "~/components/ui/button/Button.vue";
  import Input from "~/components/ui/input/Input.vue";

  import { useSessionStore } from "~/stores/session";

  const sessionStore = useSessionStore();
  const { login } = sessionStore;
  const { loading } = storeToRefs(sessionStore);

  const credentials = ref({
    username: "",
    password: "",
  });
  const showPassword = ref(false);
</script>
<style scoped></style>
