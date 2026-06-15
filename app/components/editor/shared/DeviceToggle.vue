<script setup lang="ts">
const model = defineModel<'desktop' | 'tablet' | 'mobile'>({ required: true })

const devices = [
  { value: 'desktop', icon: 'i-lucide-monitor', label: 'Desktop' },
  { value: 'tablet', icon: 'i-lucide-tablet', label: 'Tablet' },
  { value: 'mobile', icon: 'i-lucide-smartphone', label: 'Mobile' }
] as const
</script>

<template>
  <div class="flex items-center rounded-md border border-muted bg-default p-1">
    <UTooltip
      v-for="device in devices"
      :key="device.value"
      :text="device.label"
    >
      <UButton
        :icon="device.icon"
        :aria-label="device.label"
        :color="model === device.value ? 'primary' : 'neutral'"
        :variant="model === device.value ? 'soft' : 'ghost'"
        size="sm"
        @click="model = device.value"
      />
    </UTooltip>
  </div>
</template>
