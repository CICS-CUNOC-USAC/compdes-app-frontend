<script lang="ts" setup>
  import type { LabelProps } from "reka-ui";
  import type { HTMLAttributes } from "vue";
  import { cn } from "@/lib/utils";
  import { Label } from "@/components/ui/label";
  import { useFormField } from "./useFormField";

  const props = defineProps<
    LabelProps & { class?: HTMLAttributes["class"]; icon?: string }
  >();

  const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn('data-[error=true]:text-destructive-foreground', props.class)"
    :for="formItemId"
  >
    <Icon v-if="props.icon" :name="props.icon" class="size-3.5" />
    <slot />
  </Label>
</template>
