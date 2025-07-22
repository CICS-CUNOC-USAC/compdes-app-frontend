<template>
  <div class="container mx-auto p-5">
    <div class="">
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink :to="`/admin/conferences/${route.params.id}`">
          <Icon name="lucide:arrow-left" />
          Volver a <span>"{{ activity?.name || "Actividad" }}"</span>
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/inscriptions">
          <Icon name="lucide:list" />
          Volver a Actividades
        </NuxtLink>
      </Button>
      <Button as-child size="sm" variant="link" class="mb-3">
        <NuxtLink to="/admin/home">
          <Icon name="lucide:house" />
          Volver a Inicio
        </NuxtLink>
      </Button>

      <h1 class="text-2xl font-bold">Editar Actividad</h1>
    </div>

    <div v-if="error" class="text-red-600">Failed to load activity.</div>

    <LoaderIndicator v-if="status === 'pending'" />

    <Form
      v-else-if="activity"
      class="mt-3"
      @submit="handleSubmit"
      :validation-schema="schema"
      :initial-values="initialValues"
    >
      <h2
        class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4"
      >
        Acciones:
      </h2>
      <div class="mb-5 space-x-2 space-y-2">
        <Button
          size="sm"
          variant="default"
          type="submit"
          :loading="asyncStatus === 'loading'"
        >
          <Icon name="lucide:check" />
          Guardar Cambios
        </Button>
      </div>
      <h2
        class="uppercase tracking-wider text-muted-foreground text-sm font-light mb-4"
      >
        Información:
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            <Icon class="inline mb-0.5" name="lucide:user" /> Nombre
          </h2>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage name="name" />
            </FormItem>
          </FormField>
          <!-- <p class="mt-1 text-lg">{{ activity?.name }}</p> -->
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            <Icon class="inline mb-0.5" name="lucide:info" /> Descripción
          </h2>
          <!-- <p class="mt-1 text-lg">{{ activity?.description }}</p> -->
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage name="description" />
            </FormItem>
          </FormField>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            <Icon class="inline mb-0.5" name="lucide:shapes" /> Tipo
          </h2>
          <!-- <Badge class="mt-1 text-base">{{ activity?.type }}</Badge> -->
          <FormField v-slot="{ componentField }" name="type">
            <FormItem>
              <Combobox by="label" v-bind="componentField">
                <FormControl>
                  <ComboboxAnchor as-child class="">
                    <ComboboxTrigger as-child class="">
                      <Button
                        variant="outline"
                        class="justify-between rounded-md py-2.5 min-w-full max-w-full"
                      >
                        <span class="truncate font-normal">
                          {{
                            componentField.modelValue ??
                            "Selecciona un tipo de presentacion..."
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
                      placeholder="Buscar tipo..."
                      :autoFocus="false"
                    />
                    <span
                      class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
                    >
                      <Icon name="lucide:search" class="h-4 w-4 opacity-50">
                      </Icon>
                    </span>
                  </div>

                  <ComboboxEmpty class="w-full">
                    No se encontraron resultados.
                  </ComboboxEmpty>

                  <ComboboxGroup
                    v-for="group in presentationTypeList"
                    :heading="group.group"
                    :key="group.group"
                  >
                    <ComboboxItem
                      v-for="uni in group.items"
                      :key="uni"
                      :value="uni"
                      class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold"
                    >
                      <ComboboxItemIndicator>
                        <Icon name="lucide:check" class="size-4" />
                      </ComboboxItemIndicator>
                      {{ uni }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormMessage name="type" />
            </FormItem>
          </FormField>
        </div>

        <div class="md:col-span-2">
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            <Icon class="inline mb-0.5" name="lucide:calendar" /> Programación
          </h2>
          <p class="mt-1 text-lg">
            <span class="text-base text-muted-foreground">
              <Icon class="inline mb-0.5" name="lucide:clock-arrow-up" />
              Inicio:
            </span>
            {{ formatDate(activity?.initScheduledDate) }}<br />
            <span class="text-base text-muted-foreground">
              <Icon class="inline mb-0.5" name="lucide:clock-arrow-down" /> Fin:
            </span>
            {{ formatDate(activity?.endScheduledDate) }}
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            <Icon class="inline mb-0.5" name="lucide:door-open" /> Salón
          </h2>
          <!-- <p class="mt-1 text-lg">{{ activity?.classroom?.name }}</p> -->
          <FormField v-slot="{ componentField }" name="classroomId">
            <FormItem>
              <Combobox by="label" v-bind="componentField">
                <FormControl>
                  <ComboboxAnchor as-child>
                    <ComboboxTrigger as-child>
                      <Button
                        variant="outline"
                        class="justify-between rounded-md py-2.5 min-w-full max-w-full"
                      >
                        <span class="truncate font-normal">
                          {{
                            componentField.modelValue["name"] ??
                            "Selecciona un salón..."
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

                  <ComboboxGroup heading="Salones disponibles">
                    <ComboboxItem
                      v-for="salon in classrooms"
                      :key="salon.id"
                      :value="salon"
                      class="whitespace-normal cursor-pointer break-words max-w-full data-[state=checked]:font-bold"
                    >
                      <ComboboxItemIndicator>
                        <Icon name="lucide:check" class="size-4" />
                      </ComboboxItemIndicator>
                      {{ salon.name }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormMessage name="classroomId" />
            </FormItem>
          </FormField>
        </div>

        <!-- <div v-if="activity?.classroom?.moduleUni">
          <h2 class="font-semibold text-sm text-muted-foreground mb-1">
            <Icon class="inline mb-0.5" name="lucide:building" /> Módulo
          </h2>
          <p class="mt-1 text-lg">{{ activity?.classroom?.moduleUni?.name }}</p>
        </div> -->
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  import { Form } from "vee-validate";
  import { toast } from "vue-sonner";
  import { z } from "zod";
  import LoaderIndicator from "~/components/partials/LoaderIndicator.vue";
  import Button from "~/components/ui/button/Button.vue";
  import { FormField } from "~/components/ui/form";
  import type { Activity } from "~/lib/api/conferencias";
  import { getSalones } from "~/lib/api/salones";

  const route = useRoute();
  const {
    data: activity,
    error,
    status,
  } = await useAsyncData<Activity>(() =>
    $api(`/activities/${route.params.id}`),
  );

  // we have to map the activity.classroom.id to the classroomId field and leave the rest of fields as they are
  const initialValues = computed(() => {
    if (!activity.value) return {};
    return {
      ...activity.value,
      classroomId: activity.value.classroom || undefined,
    };
  });

  const { data: classrooms } = await useAsyncData(() => getSalones(), {
    lazy: true,
  });

  const zSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().optional(),
    type: z.string().optional(),
    initScheduledDate: z.string().optional(),
    endScheduledDate: z.string().optional(),
    classroomId: z
      .object({
        id: z.string().min(1, "El salón es obligatorio"),
        name: z.string().optional(), // Optional to allow for display purposes
      })
      .optional(),
  });
  const schema = toTypedSchema(zSchema);

  async function handleSubmit(values: z.infer<typeof zSchema>) {
    console.log("Submitting form with values:", values.classroomId?.id);
    // Trigger the mutation to update the activity
    // mutate(values);
    await $api(`/activities/${route.params.id}`, {
        method: "PATCH",
        body: {
          ...values,
          classroomId: values.classroomId?.id, // Use the ID for the API call
        },
      })
  }

  const { mutate, asyncStatus } = useMutation({
    mutation: (values: z.infer<typeof zSchema>) =>
      $api(`/activities/${route.params.id}`, {
        method: "PUT",
        body: {
          ...values,
          classroomId: values.classroomId?.id, // Use the ID for the API call
        },
      }),
    onSuccess: () => {
      toast.success("Actividad actualizada correctamente");
      navigateTo(`/admin/conferences/${route.params.id}`);
    },
    onError: (error) => {
      toast.error("Error al actualizar la actividad");
      console.error("Error updating activity:", error);
    },
  });

  definePageMeta({
    layout: "admin",
    title: "Detalles de Actividad",
  });

  function formatDate(dateString?: string): string {
    return dateString
      ? format(new Date(dateString), "HH:mm 'del' EEEE dd 'de' MMMM yyyy", {
          locale: es,
        })
      : "Fecha no disponible";
  }
</script>
