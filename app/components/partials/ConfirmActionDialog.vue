<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <!-- <Button variant="outline"> Show Dialog </Button> -->
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent class="rounded-4xl">
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{ props.title }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex">
        <AlertDialogCancel as-child>
          <Button variant="secondary" class="py-2"> Cancelar </Button>
        </AlertDialogCancel>
        <AlertDialogAction as-child>
          <Button @click="$emit('confirm')" class="py-2">
            <Icon name="lucide:check" />
            Confirmar
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
<script setup>
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../ui/alert-dialog";

  const emit = defineEmits(["confirm"]);

  const props = defineProps({
    title: {
      type: String,
      default: "Confirmar acción",
    },
    description: {
      type: String,
      default: "¿Estás seguro de que deseas continuar?",
    },
  });
</script>
<style scoped></style>
