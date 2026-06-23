<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  eyebrow?: string
  variant?: string
  maxItems?: number
  showPinnedOnly?: boolean
  accent?: string
  background?: string
  align?: string
  columns?: string
  showIcon?: boolean
  showPriorityBadge?: boolean
  showContent?: boolean
  data?: Record<string, any>
}>(), {
  title: 'Announcements',
  eyebrow: 'Notices',
  variant: 'cards',
  maxItems: 3,
  showPinnedOnly: false,
  accent: 'primary',
  background: 'surface',
  align: 'left',
  columns: '3',
  showIcon: true,
  showPriorityBadge: true,
  showContent: true,
  data: () => ({})
})

interface Item {
  id: string
  title: string
  content?: string
  priority?: string
  isPinned?: boolean
  isUrgent: boolean
  badge: string | null
}

const items = computed<Item[]>(() => {
  const announcements = (props.data?.announcements ?? []) as Array<Record<string, any>>
  return announcements
    .filter(item => !props.showPinnedOnly || item.isPinned)
    .slice(0, props.maxItems)
    .map((item, i) => {
      const isUrgent = item.priority === 'URGENT'
      return {
        id: item.id ?? String(i),
        title: item.title,
        content: item.content,
        priority: item.priority,
        isPinned: item.isPinned,
        isUrgent,
        badge: isUrgent ? 'Urgent' : item.isPinned ? 'Pinned' : null
      }
    })
})

const hasItems = computed(() => items.value.length > 0)
const topItem = computed(() => items.value[0] ?? null)
const restItems = computed(() => items.value.slice(1))

// Accent + background system, mirrored from the other upgraded widgets.
const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

const isFilled = computed(() => props.background !== 'surface')

// Banner/ticker are inherently "bars" and always need an opaque surface; the
// card-grid variants keep the legacy transparent section on `surface`.
const isBar = computed(() => props.variant === 'banner' || props.variant === 'ticker')
// The root carries a real background when filled or when it's a bar variant;
// otherwise the card-grid variants keep the legacy transparent section.
const rootHasBackground = computed(() => isFilled.value || isBar.value)

const containerStyle = computed(() => {
  if (!rootHasBackground.value) return {}
  if (props.background === 'gradient') {
    return { background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))` }
  }
  if (props.background === 'solid') {
    return { background: accentVar.value }
  }
  // surface bar: opaque card so the bar reads as a distinct strip
  return {
    background: 'var(--color-surface)',
    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent)'
  }
})

const headingColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.78)' : 'var(--color-text-muted)')
const accentTextColor = computed(() => isFilled.value ? 'var(--color-secondary)' : accentVar.value)
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')

// Inner card surface for the cards/list/feature variants.
const cardSurfaceStyle = computed(() => isFilled.value
  ? { background: 'rgba(255,255,255,0.12)' }
  : { background: 'var(--color-surface)', boxShadow: `inset 0 0 0 1px ${hairlineColor.value}` })

const rootClass = computed(() => {
  const cls = ['@container', 'h-full', 'overflow-hidden']
  if (rootHasBackground.value) cls.push('rounded-lg', isBar.value ? 'px-6 py-4' : 'p-6')
  return cls
})

const alignClass = computed(() => props.align === 'center' ? 'text-center' : 'text-left')
const cardGridClass = computed(() => props.columns === '2' ? '@xl:grid-cols-2' : '@xl:grid-cols-3')

function badgeStyle(item: Item) {
  if (item.isUrgent) {
    return {
      background: isFilled.value ? 'rgba(255,255,255,0.2)' : 'color-mix(in srgb, var(--color-warning, #d97706) 16%, var(--color-surface))',
      color: isFilled.value ? '#fff' : 'var(--color-warning, #b45309)'
    }
  }
  return { background: hairlineColor.value, color: headingColor.value }
}

</script>

<template>
  <div
    :class="rootClass"
    :style="containerStyle"
  >
    <!-- Banner: single prominent bar, ideal for the sticky option -->
    <template v-if="variant === 'banner'">
      <div v-if="hasItems" class="flex items-center gap-4">
        <UIcon
          v-if="showIcon"
          name="i-lucide-megaphone"
          class="size-6 shrink-0"
          :style="{ color: accentTextColor }"
        />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-if="showPriorityBadge && topItem?.badge"
              class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :style="badgeStyle(topItem)"
            >{{ topItem.badge }}</span>
            <p class="truncate font-semibold" :style="{ color: headingColor }">
              {{ topItem?.title }}
            </p>
          </div>
          <p
            v-if="showContent && topItem?.content"
            class="mt-0.5 truncate text-sm"
            :style="{ color: mutedColor }"
          >
            {{ topItem.content }}
          </p>
        </div>
      </div>
      <p v-else class="text-sm" :style="{ color: mutedColor }">
        No announcements yet.
      </p>
    </template>

    <!-- Ticker: compact stacked strip of notices -->
    <template v-else-if="variant === 'ticker'">
      <div class="flex items-center gap-3">
        <span
          class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
          :style="{ background: hairlineColor, color: accentTextColor }"
        >
          {{ eyebrow }}
        </span>
        <ul class="flex min-w-0 flex-1 flex-col gap-1">
          <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center gap-2 truncate"
          >
            <span
              v-if="showPriorityBadge && item.badge"
              class="size-1.5 shrink-0 rounded-full"
              :style="{ background: item.isUrgent ? 'var(--color-warning, #d97706)' : accentTextColor }"
            />
            <span class="truncate text-sm font-medium" :style="{ color: headingColor }">
              {{ item.title }}
            </span>
          </li>
        </ul>
      </div>
    </template>

    <!-- Header (shared by cards / list / feature) -->
    <template v-else>
      <div class="mb-5 flex items-start justify-between gap-4" :class="alignClass">
        <div :class="{ 'mx-auto': align === 'center' }">
          <p v-if="eyebrow" class="text-sm font-semibold" :style="{ color: accentTextColor }">
            {{ eyebrow }}
          </p>
          <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
            {{ title }}
          </h2>
        </div>
        <UIcon
          v-if="showIcon"
          name="i-lucide-megaphone"
          class="size-8 shrink-0"
          :style="{ color: accentTextColor }"
        />
      </div>

      <!-- Empty state -->
      <p v-if="!hasItems" class="text-sm" :style="{ color: mutedColor }">
        No announcements have been published yet.
      </p>

      <!-- Feature: top notice spotlighted, the rest listed -->
      <template v-else-if="variant === 'feature'">
        <div
          class="rounded-lg p-5"
          :style="isFilled
            ? { background: 'rgba(255,255,255,0.12)' }
            : { background: `color-mix(in srgb, ${accentVar} 7%, var(--color-surface))`, boxShadow: `inset 0 0 0 1px ${hairlineColor}` }"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-xl font-bold" :style="{ color: headingColor }">
              {{ topItem?.title }}
            </h3>
            <span
              v-if="showPriorityBadge && topItem?.badge"
              class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
              :style="badgeStyle(topItem)"
            >{{ topItem.badge }}</span>
          </div>
          <p
            v-if="showContent && topItem?.content"
            class="mt-2 text-sm leading-6"
            :style="{ color: mutedColor }"
          >
            {{ topItem.content }}
          </p>
        </div>
        <ul v-if="restItems.length" class="mt-3">
          <li
            v-for="(item, i) in restItems"
            :key="item.id"
            class="flex items-start justify-between gap-3 py-3"
            :class="i > 0 ? 'border-t' : ''"
            :style="{ borderColor: hairlineColor }"
          >
            <div>
              <p class="font-semibold leading-tight" :style="{ color: headingColor }">
                {{ item.title }}
              </p>
              <p
                v-if="showContent && item.content"
                class="mt-0.5 text-sm"
                :style="{ color: mutedColor }"
              >
                {{ item.content }}
              </p>
            </div>
            <span
              v-if="showPriorityBadge && item.badge"
              class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :style="badgeStyle(item)"
            >{{ item.badge }}</span>
          </li>
        </ul>
      </template>

      <!-- List: single column of cards (preserves the legacy `list` look) -->
      <template v-else-if="variant === 'list'">
        <div class="grid gap-3">
          <article
            v-for="item in items"
            :key="item.id"
            class="rounded-lg p-5"
            :style="cardSurfaceStyle"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="font-semibold" :style="{ color: headingColor }">
                {{ item.title }}
              </h3>
              <span
                v-if="showPriorityBadge && item.badge"
                class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :style="badgeStyle(item)"
              >{{ item.badge }}</span>
            </div>
            <p
              v-if="showContent && item.content"
              class="mt-3 text-sm leading-6"
              :style="{ color: mutedColor }"
            >
              {{ item.content }}
            </p>
          </article>
        </div>
      </template>

      <!-- Cards (default) -->
      <template v-else>
        <div class="grid gap-4" :class="cardGridClass">
          <article
            v-for="item in items"
            :key="item.id"
            class="rounded-lg p-5"
            :style="cardSurfaceStyle"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="font-semibold" :style="{ color: headingColor }">
                {{ item.title }}
              </h3>
              <span
                v-if="showPriorityBadge && item.badge"
                class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :style="badgeStyle(item)"
              >{{ item.badge }}</span>
            </div>
            <p
              v-if="showContent && item.content"
              class="mt-3 text-sm leading-6"
              :style="{ color: mutedColor }"
            >
              {{ item.content }}
            </p>
          </article>
        </div>
      </template>
    </template>
  </div>
</template>
