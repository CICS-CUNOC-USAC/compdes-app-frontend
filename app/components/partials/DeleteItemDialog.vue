<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <!-- <Button variant="outline"> Show Dialog </Button> -->
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent class="rounded-4xl">
      <AlertDialogHeader>
        <AlertDialogTitle>¿Eliminar este ítem?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta acción eliminará el ítem de forma permanente. ¿Estás seguro de que deseas continuar?
          <br />
          <strong> Esta acción no se puede deshacer.</strong>
          <br />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex">
        <AlertDialogCancel as-child>
          <Button variant="secondary" class="py-2"> Cancelar </Button>
        </AlertDialogCancel>
        <AlertDialogAction as-child>
          <Button variant="destructive" @click="$emit('confirm')" class="py-2">
            <Icon name="lucide:trash" />
            Eliminar
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
</script>
<style scoped></style>
