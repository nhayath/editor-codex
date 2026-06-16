<script setup lang="ts">
import { isIslamicIconName } from '~~/utils/islamic-icons'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  name?: string
}>(), {
  name: ''
})

const attrs = useAttrs()
const isIslamicIcon = computed(() => isIslamicIconName(props.name))
const spriteHref = computed(() => `/icons/islamic-sprite.svg#${props.name}`)
</script>

<template>
  <svg
    v-if="isIslamicIcon"
    v-bind="attrs"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <use :href="spriteHref" />
  </svg>
  <UIcon
    v-else
    v-bind="attrs"
    :name="name || 'i-lucide-sparkles'"
  />
</template>
