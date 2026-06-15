<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  label?: string
  value?: string
  colors?: string[]
}>()
</script>

<template>
  <button
    type="button"
    class="group flex w-full items-center gap-3 rounded-md border border-muted bg-default p-3 text-left transition hover:bg-muted"
    :class="model === value ? 'ring-2 ring-primary' : ''"
    @click="value && (model = value)"
  >
    <span class="flex shrink-0 overflow-hidden rounded-md border border-muted">
      <span
        v-for="color in colors"
        :key="color"
        class="block size-7"
        :style="{ backgroundColor: color }"
      />
    </span>
    <span class="min-w-0 text-sm font-medium text-default">{{ label }}</span>
    <UIcon
      v-if="model === value"
      name="i-lucide-check"
      class="ml-auto size-4 text-primary"
    />
  </button>
</template>
