<template>
  <div class="h-full container mx-auto grid p-12 gap-6 place-content-center" :class="{
    '': !data || status !== 'success',
    'grid-cols-1 lg:grid-cols-2': data && (status === 'success' || status === 'pending'),
  }">
    <section class="max-w-md space-y-6 justify-self-center">
      <h1 class="text-2xl font-bold text-center">Revisar inscripción</h1>
      <p class="text-center text-muted-foreground">
        Ingresa tu número de identificación personal (pasaporte o identificación
        nacional) que utilizaste al momento de inscribirte para verificar el
        estado de tu inscripción.
      </p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <Label icon="lucide:id-card" for="identification">
          Número de identificación
        </Label>
        <Input id="identification" name="identification" type="text" :default-value="route.query.id || ''"
          placeholder="1234567890" class="mt-2 mb-4" required />

        <Button type="submit" class="w-full mt-2" :loading="status === 'pending'">
          <Icon name="lucide:badge-check" class="mr-2" />
          Comprobar
        </Button>
      </form>
    </section>
    <Transition name="fade-and-slide" mode="out-in">
      <section v-if="data && status === 'success'">
        <h1 class="text-xl text-muted-foreground font-bold text-center mb-6">
          Hemos encontrado tu inscripción:
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="font-semibold text-sm text-muted-foreground">Nombre</h2>
            <p class="mt-1 text-lg">{{ data.firstName }} {{ data.lastName }}</p>
          </div>

          <div>
            <h2 class="font-semibold text-sm text-muted-foreground">
              Universidad
            </h2>
            <p class="mt-1 text-lg">{{ data.organisation }}</p>
          </div>

          <div v-if="data.isAuthor">
            <h2 class="font-semibold text-lg border p-2 rounded-lg border-border">
              Autor
            </h2>
          </div>

          <div v-if="data.isGuest">
            <h2 class="font-semibold text-lg border p-2 rounded-lg border-border">
              Invitado
            </h2>
          </div>

          <div>
            <h2 class="font-semibold text-sm text-muted-foreground">Estado</h2>
            <span class="mt-1 inline-block px-3 py-1 rounded-full text-sm" :class="data.registrationStatus.isApproved
                ? 'text-green-800 dark:text-green-900 bg-green-100 dark:bg-green-200'
                : 'text-yellow-800 dark:text-yellow-900 bg-yellow-100 dark:bg-yellow-200'
              ">
              {{
                data.registrationStatus.isApproved ? "Aprobado" : "Pendiente"
              }}
            </span>
          </div>
          <div>
            <span v-if="data.registrationStatus.isApproved">
              Tu inscripcion ha sido aprobada! <br>
              Revisa tu correo para registrarte o <br>
              <NuxtLink to="/login" class="text-base font-semibold text-black underline transition hover:text-brand-red">
                inicia sesion aqui
              </NuxtLink>
            </span>
          </div>
        </div>
      </section>
      <LoaderIndicator v-else-if="status === 'pending' && data" />
    </Transition>
  </div>
</template>
<script setup>
import { toast } from "vue-sonner";
import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
import Button from "~/components/ui/button/Button.vue";
import Input from "~/components/ui/input/Input.vue";
import Label from "~/components/ui/label/Label.vue";
import { verifyInscriptionById } from "~/lib/api/inscriptions";

const route = useRoute();

const { data, status, execute } = useAsyncData(
  route.query.id || "",
  () =>
    verifyInscriptionById(route.query.id, {
      onResponseError: ({ response }) => {
        const responseCode = response.status;
        const errorTitle =
          responseCode === 404
            ? "Inscripción no encontrada"
            : "No hemos podido verificar tu inscripción";

        toast.error(errorTitle, {
          description:
            response._data?.message ||
            "Error inesperado al verificar inscripción",
        });
      },
    }),
  {
    immediate: false,
  },
);

const handleSubmit = async (e) => {
  const form = e.target;
  const identification = form.identification.value.trim();
  if (!identification) {
    return;
  }
  await navigateTo({
    query: { id: identification },
  });
  execute();
};
</script>
<style scoped>
@reference '~/assets/css/main.css';

.fade-and-slide-enter-active,
.fade-and-slide-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.fade-and-slide-enter-from,
.fade-and-slide-leave-to {
  @apply opacity-0 translate-y-4;
}

.fade-and-slide-enter-to,
.fade-and-slide-leave-from {
  @apply opacity-100 translate-y-0;
}
</style>
