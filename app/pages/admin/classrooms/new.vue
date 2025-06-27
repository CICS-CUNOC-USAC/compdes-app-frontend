<template>
  <div class="container mx-auto h-full pt-5 px-5">
    <div class="flex flex-col h-full">
      <div class="">
        <Button as-child size="sm" variant="link" class="mb-3">
          <NuxtLink to="/admin/classrooms">
            <Icon name="lucide:arrow-left" />
            Volver a Salones
          </NuxtLink>
        </Button>
        <Button as-child size="sm" variant="link" class="mb-3">
          <NuxtLink to="/admin/home">
            <Icon name="lucide:house" />
            Volver a Inicio
          </NuxtLink>
        </Button>

        <h1 class="text-2xl font-bold">Crear Salón</h1>
      </div>
      <Alert
        v-if="showSalonError"
        variant="destructive"
        class="mb-4 flex items-start justify-between"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:alert-triangle" class="size-4 text-red-600" />
          <div>
            <AlertTitle class="font-semibold">Error</AlertTitle>
            <AlertDescription class="text-sm">
              {{ errorMessage }}
            </AlertDescription>
          </div>
        </div>
        <button
          aria-label="Cerrar alerta"
          @click="showSalonError = false"
          class="ml-4 text-red-600 hover:text-red-800"
          style="font-weight: bold"
        >
          <Icon name="lucide:x" class="size-4" />
        </button>
      </Alert>

      <main class="grid place-items-center h-full">
        <div class="max-w-md w-full p-6">
          <div class="flex justify-center mb-2 text-primary text-4xl">
            <Icon name="lucide:presentation" />
          </div>

          <!-- <h1 class="text-2xl font-bold text-center mb-6">Crear Salon</h1> -->
          <form @submit.prevent="crearSalon" class="space-y-6">
            <div class="space-y-2">
              <Label for="name">Nombre:</Label>
              <Input v-model="form.name" type="text" id="name" required />
            </div>

            <FormField v-slot="{ componentField }" name="moduleId">
              <FormItem>
                <FormLabel icon="lucide:mic-vocal">Modulo</FormLabel>

                <Combobox
                  by="label"
                  v-bind="componentField"
                  v-model="form.module"
                >
                  <FormControl>
                    <ComboboxAnchor as-child>
                      <ComboboxTrigger as-child>
                        <Button
                          variant="outline"
                          class="justify-between rounded-md py-2.5 min-w-full max-w-full"
                        >
                          <span class="truncate font-normal">
                            {{
                              form.module
                                ? form.module.name
                                : "Selecciona un modulo..."
                            }}
                          </span>
                          <Icon
                            name="lucide:chevrons-up-down"
                            class="ml-2 h-4 w-4 shrink-0 opacity-50"
                          />
                        </Button>
                      </ComboboxTrigger>
                    </ComboboxAnchor>
                  </FormControl>

                  <ComboboxList class="max-h-[300px] overflow-y-auto !block">
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        class="pl-0 focus-visible:ring-0 rounded-none h-10"
                        placeholder="Buscar salón..."
                        :autoFocus="false"
                        :display-value="(value) => value.name"
                      />
                      <span
                        class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <Icon name="lucide:search" class="h-4 w-4 opacity-50" />
                      </span>
                    </div>

                    <ComboboxEmpty class="w-full">
                      No se encontraron resultados.
                    </ComboboxEmpty>

                    <ComboboxGroup heading="Modulos disponibles">
                      <ComboboxItem
                        v-for="module in modulos"
                        :key="module.id"
                        :value="module"
                        class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold"
                      >
                        <!-- <ComboboxItemIndicator>
                          <Icon name="lucide:check" class="size-4" />
                        </ComboboxItemIndicator> -->
                        {{ module.name }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </Combobox>
                <FormMessage name="classroomId" />
              </FormItem>
            </FormField>

            <Button
              type="submit"
              class="w-full"
              :loading="asyncStatus === 'loading'"
            >
              <Icon name="lucide:shield-check" />
              Crear Salon
            </Button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import Button from "~/components/ui/button/Button.vue";
  import Input from "~/components/ui/input/Input.vue";
  import Label from "~/components/ui/label/Label.vue";

  import Alert from "~/components/ui/alert/Alert.vue";
  import AlertDescription from "~/components/ui/alert/AlertDescription.vue";
  import AlertTitle from "~/components/ui/alert/AlertTitle.vue";

  import type { Modulo } from "~/lib/api/modules";
  import { postSalones } from "~/lib/api/salones";
  import type { PageableResponse } from "~/lib/api/shared";
import { toast } from "vue-sonner";
  const form = ref({
    name: "",
    module: undefined as Modulo | null | undefined,
  });

  const showSalonError = ref(false);
  const errorMessage = ref("");

  const { data: modulos } = await useAsyncData<Modulo[]>(() =>
    $api("/modules/all"),
  );

  const { mutate, asyncStatus } = useMutation({
    mutation: (val: { name: string; moduleId: string | number }) =>
      postSalones(val),
    onSuccess: (response) => {
      toast.success(response.message || "Salón creado con éxito");
      // form.value.name = "";
      // form.value.module = null;
      navigateTo("/admin/classrooms");
    },
    onError: (error) => {
      errorMessage.value =
        error.data?.message || "Error al crear el salon. Intenta de nuevo.";
      showSalonError.value = true;
    },
  });

  const crearSalon = () => {
    showSalonError.value = false;
    errorMessage.value = "";

    if (!form.value.name || form.value.name.trim().length === 0) {
      errorMessage.value = "El nombre es obligatorio.";
      showSalonError.value = true;
      return;
    }

    mutate({
      name: form.value.name,
      moduleId: form.value.module?.id || "",
    });
  };

  definePageMeta({
    layout: "admin",
    title: "Crear Salón",
  });
</script>

<style scoped></style>
