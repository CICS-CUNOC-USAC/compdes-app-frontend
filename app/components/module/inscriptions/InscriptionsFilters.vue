<template>
  <h3 class="text-lg font-semibold pb-4 flex items-center gap-2">
    Filtros
    <Button
      variant="ghost"
      size="sm"
      @click="handleCleanAllFilters"
      :disabled="props.loading"
    >
      <Icon name="lucide:trash-2" class="mr-2" />
      Limpiar todos los filtros
    </Button>
  </h3>

  <fieldset
    class="grid grid-cols-1 md:grid-cols-4 gap-4"
    v-bind="$attrs"
    :disabled="props.loading"
  >
    <div class="space-y-2">
      <Label icon="lucide:user" class="flex gap-1">Nombre</Label>
      <Input
        placeholder="Buscar por nombre"
        @input="(e) => inputHandlers.firstName(e.target.value)"
        :model-value="$route.query.firstName || ''"
      />
    </div>

    <div class="space-y-2">
      <Label icon="lucide:user" class="flex gap-1">Apellido</Label>
      <Input
        placeholder="Buscar por apellido"
        @input="(e) => inputHandlers.lastName(e.target.value)"
        :model-value="$route.query.lastName || ''"
      />
    </div>

    <div class="space-y-2">
      <Label icon="lucide:mail" class="flex gap-1">Correo</Label>
      <Input
        placeholder="Buscar por correo electrónico"
        @input="(e) => inputHandlers.email(e.target.value)"
        :model-value="$route.query.email || ''"
      />
    </div>

    <div class="space-y-2">
      <Label icon="lucide:school" class="flex gap-1">Universidad</Label>
      <Input
        placeholder="Buscar por universidad"
        @input="(e) => inputHandlers.organisation(e.target.value)"
        :model-value="$route.query.organisation || ''"
      />
    </div>

    <div class="space-y-2">
      <Label icon="lucide:id-card" class="flex gap-1">Identificación</Label>
      <Input
        placeholder="Buscar por número de identificación"
        @input="(e) => inputHandlers.identificationDocument(e.target.value)"
        :model-value="$route.query.identificationDocument || ''"
      />
    </div>

    <div class="space-y-2">
      <Label icon="lucide:receipt" class="flex gap-1">Comprobante</Label>
      <Input
        placeholder="Buscar por número de comprobante"
        @input="(e) => inputHandlers.voucherNumber(e.target.value)"
        :model-value="$route.query.voucherNumber || ''"
      />
    </div>

    <div
      class="self-center col-span-1 md:col-span-2 flex items-center gap-2 flex-wrap"
    >
      <Label
        class="inline-flex items-center cursor-pointer text-muted-foreground group hover:text-foreground transition-colors"
      >
        <Checkbox
          @update:model-value="
            (val) => inputHandlers.isAuthor(val ? 'true' : '')
          "
          :model-value="$route.query.isAuthor === 'true'"
          class="size-5 group-hover:border-muted-foreground transition-colors"
          id="isAuthor"
        />
        Autores
      </Label>
      <Label
        class="inline-flex items-center cursor-pointer text-muted-foreground group hover:text-foreground transition-colors"
      >
        <Checkbox
          @update:model-value="
            (val) => inputHandlers.isGuest(val ? 'true' : '')
          "
          :model-value="$route.query.isGuest === 'true'"
          class="size-5 group-hover:border-muted-foreground transition-colors"
          id="isGuest"
        />
        Invitados
      </Label>
      <Label
        class="inline-flex items-center cursor-pointer text-muted-foreground group hover:text-foreground transition-colors"
      >
        <Checkbox
          @update:model-value="
            (val) => inputHandlers.isTransferPayment(val ? 'true' : '')
          "
          :model-value="$route.query.isTransferPayment === 'true'"
          class="size-5 group-hover:border-muted-foreground transition-colors"
          id="isTransferPayment"
        />
        Transferencia
      </Label>
      <Label
        class="inline-flex items-center cursor-pointer text-muted-foreground group hover:text-foreground transition-colors"
      >
        <Checkbox
          @update:model-value="
            (val) => inputHandlers.isCardPayment(val ? 'true' : '')
          "
          :model-value="$route.query.isCardPayment === 'true'"
          class="size-5 group-hover:border-muted-foreground transition-colors"
          id="isCardPayment"
        />
        Tarjeta
      </Label>
      <Label
        class="inline-flex items-center cursor-pointer text-muted-foreground group hover:text-foreground transition-colors"
      >
        <Checkbox
          @update:model-value="
            (val) => inputHandlers.isCashPayment(val ? 'true' : '')
          "
          :model-value="$route.query.isCashPayment === 'true'"
          class="size-5 group-hover:border-muted-foreground transition-colors"
          id="isCashPayment"
        />
        Efectivo
      </Label>
      <Label
        class="inline-flex items-center cursor-pointer text-muted-foreground group hover:text-foreground transition-colors"
      >
        <Checkbox
          @update:model-value="
            (val) => inputHandlers.isApproved(val ? 'true' : '')
          "
          :model-value="$route.query.isApproved === 'true'"
          class="size-5 group-hover:border-muted-foreground transition-colors"
          id="isApproved"
        />
        Aprobados
      </Label>
    </div>
  </fieldset>
</template>
<script setup>
  import Input from "~/components/ui/input/Input.vue";
  import Label from "~/components/ui/label/Label.vue";

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const route = useRoute();

  function handleCleanAllFilters() {
    navigateTo({
      query: undefined, // Limpia todos los filtros
    });
  }

  function createInputHandler(field, options) {
    const updateQuery = (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: 0,
          [field]: value || undefined,
        },
      });
    };

    return options?.debounce ? useDebounceFn(updateQuery, 500) : updateQuery;
  }

  const inputHandlers = {
    firstName: createInputHandler("firstName", { debounce: true }),
    lastName: createInputHandler("lastName", { debounce: true }),
    email: createInputHandler("email", { debounce: true }),
    organisation: createInputHandler("organisation", { debounce: true }),
    identificationDocument: createInputHandler("identificationDocument", {
      debounce: true,
    }),
    voucherNumber: createInputHandler("voucherNumber", { debounce: true }),

    // Filtros de tipo booleano
    isAuthor: createInputHandler("isAuthor"), // sin debounce
    isGuest: createInputHandler("isGuest"), // sin debounce
    isTransferPayment: createInputHandler("isTransferPayment"), // sin debounce
    isCardPayment: createInputHandler("isCardPayment"), // sin debounce
    isCashPayment: createInputHandler("isCashPayment"), // sin debounce
    isApproved: createInputHandler("isApproved"), // sin debounce
  };
</script>
<style scoped></style>
