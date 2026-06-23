<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  variant?: string
  messages?: string
  rotateSeconds?: number
  sticky?: boolean
  dismissible?: boolean
  background?: string
  accent?: string
  align?: string
  icon?: string
  showIcon?: boolean
  data?: Record<string, any>
}>(), {
  variant: 'single',
  messages: '',
  rotateSeconds: 5,
  sticky: true,
  dismissible: true,
  background: 'solid',
  accent: 'primary',
  align: 'center',
  icon: 'i-lucide-megaphone',
  showIcon: true,
  data: () => ({})
})

interface Message {
  text: string
  linkLabel: string
  linkUrl: string
}

// One message per line: `Text | Link label | URL` (link parts optional).
const messages = computed<Message[]>(() =>
  parsePipeRows(props.messages, 3)
    .map(([text, linkLabel, linkUrl]) => ({ text, linkLabel, linkUrl }))
    .filter(m => m.text)
)
const hasMessages = computed(() => messages.value.length > 0)

// Rotation (rotating variant only) — cycle through the messages on a timer.
const index = ref(0)
const current = computed(() => messages.value[index.value] ?? messages.value[0] ?? null)
onMounted(() => {
  if (props.variant === 'rotating' && messages.value.length > 1) {
    const ms = Math.max(2, props.rotateSeconds) * 1000
    const timer = window.setInterval(() => {
      index.value = (index.value + 1) % messages.value.length
    }, ms)
    onBeforeUnmount(() => window.clearInterval(timer))
  }
})

// Dismiss — client-only, persisted per message set so it stays hidden until the
// admin changes the wording. SSR-safe (read inside onMounted).
const dismissed = ref(false)
const storageKey = computed(() => `announce-bar:${hashString(props.messages ?? '')}`)
function hashString(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (Math.imul(31, h) + value.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}
onMounted(() => {
  if (props.dismissible) {
    try {
      dismissed.value = window.localStorage.getItem(storageKey.value) === '1'
    } catch { /* ignore */ }
  }
})
function dismiss() {
  dismissed.value = true
  try {
    window.localStorage.setItem(storageKey.value, '1')
  } catch { /* ignore */ }
}

// Accent + background system, mirrored from the other upgraded widgets.
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

const isFilled = computed(() => props.background !== 'surface')

const barStyle = computed(() => {
  if (props.background === 'gradient') {
    return { background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))` }
  }
  if (props.background === 'solid') {
    return { background: accentVar.value }
  }
  return {
    background: 'var(--color-surface)',
    boxShadow: 'inset 0 -1px 0 0 color-mix(in srgb, var(--color-text) 12%, transparent)'
  }
})

const textColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)')
const linkColor = computed(() => isFilled.value ? '#fff' : accentVar.value)

const rowJustify = computed(() => props.align === 'center' ? 'justify-center' : 'justify-start')
</script>

<template>
  <div
    v-if="hasMessages && !dismissed"
    class="w-full"
    :class="sticky ? 'sticky top-0 z-50 shadow-md' : ''"
    :style="barStyle"
  >
    <div class="tenant-container flex items-center gap-3 py-2.5">
      <div
        class="flex min-w-0 flex-1 items-center gap-2.5"
        :class="rowJustify"
      >
        <UIcon
          v-if="showIcon && icon"
          :name="icon"
          class="size-4 shrink-0"
          :style="{ color: isFilled ? '#fff' : accentVar }"
        />
        <p class="min-w-0 truncate text-sm font-medium" :style="{ color: textColor }">
          {{ current?.text }}
        </p>
        <a
          v-if="current?.linkUrl && current?.linkLabel"
          :href="current.linkUrl"
          class="shrink-0 text-sm font-semibold underline underline-offset-2 hover:opacity-80"
          :style="{ color: linkColor }"
        >
          {{ current.linkLabel }}
        </a>
      </div>

      <button
        v-if="dismissible"
        type="button"
        class="shrink-0 rounded-md p-1 transition hover:opacity-70"
        aria-label="Dismiss announcement"
        @click="dismiss"
      >
        <UIcon name="i-lucide-x" class="size-4" :style="{ color: mutedColor }" />
      </button>
    </div>
  </div>
</template>
