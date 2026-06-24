<script setup lang="ts">
// Preset amount chips + optional custom input and one-off/monthly toggle.
// Purely presentational: the parent owns selection state and URL building.
interface PickerColors {
  activeBg: string
  activeText: string
  idleText: string
  border: string
  muted: string
}

const props = withDefaults(defineProps<{
  presets?: number[]
  selected?: number | null
  custom?: string
  allowCustom?: boolean
  frequencyToggle?: boolean
  frequency?: 'once' | 'monthly'
  currency?: string
  colors: PickerColors
}>(), {
  presets: () => [],
  selected: null,
  custom: '',
  allowCustom: true,
  frequencyToggle: false,
  frequency: 'once',
  currency: '£'
})

const emit = defineEmits<{
  select: [amount: number]
  custom: [event: Event]
  frequency: [value: 'once' | 'monthly']
}>()

const isCustomActive = computed(() => props.selected !== null && !props.presets.includes(props.selected))

function chipStyle(active: boolean) {
  return active
    ? { background: props.colors.activeBg, color: props.colors.activeText, borderColor: props.colors.activeBg }
    : { background: 'transparent', color: props.colors.idleText, borderColor: props.colors.border }
}
</script>

<template>
  <div>
    <div
      v-if="frequencyToggle"
      class="mb-3 inline-flex rounded-full p-0.5"
      :style="{ boxShadow: `inset 0 0 0 1px ${colors.border}` }"
    >
      <button
        v-for="opt in (['once', 'monthly'] as const)"
        :key="opt"
        type="button"
        class="rounded-full px-3 py-1 text-xs font-semibold capitalize transition"
        :style="chipStyle(frequency === opt)"
        @click="emit('frequency', opt)"
      >
        {{ opt === 'once' ? 'One-off' : 'Monthly' }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="amount in presets"
        :key="amount"
        type="button"
        class="rounded-md border px-3 py-1.5 text-sm font-semibold tabular-nums transition"
        :style="chipStyle(selected === amount)"
        @click="emit('select', amount)"
      >
        {{ currency }}{{ amount }}
      </button>

      <label
        v-if="allowCustom"
        class="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm"
        :style="chipStyle(isCustomActive)"
      >
        <span class="font-semibold">{{ currency }}</span>
        <input
          :value="custom"
          inputmode="decimal"
          placeholder="Other"
          class="w-16 bg-transparent text-sm outline-none placeholder:opacity-60"
          :style="{ color: isCustomActive ? colors.activeText : colors.idleText }"
          @input="emit('custom', $event)"
        >
      </label>
    </div>
  </div>
</template>
