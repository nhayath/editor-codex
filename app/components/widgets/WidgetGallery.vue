<script setup lang="ts">
import { parsePipeRows } from '~~/utils/widget-content'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  imageUrls?: string
  variant?: string
  accent?: string
  background?: string
  align?: string
  columns?: string
  imageRatio?: string
  showCaptions?: boolean
  showLightbox?: boolean
}>(), {
  eyebrow: 'Moments',
  title: 'Gallery',
  intro: '',
  imageUrls: '/templates/mosque-hero-1.svg\n/templates/mosque-hero-2.svg\n/templates/mosque-hero-3.svg',
  variant: 'grid',
  accent: 'primary',
  background: 'surface',
  align: 'left',
  columns: '3',
  imageRatio: 'landscape',
  showCaptions: false,
  showLightbox: true
})

interface GalleryImage {
  src: string
  alt: string
  caption: string
}

const images = computed<GalleryImage[]>(() => {
  return parsePipeRows(props.imageUrls, 3)
    .map((row, index) => {
      const src = row[0] ?? ''
      const alt = row[1] ?? ''
      const caption = row[2] ?? ''
      return {
        src,
        alt: alt || caption || `${props.title} ${index + 1}`,
        caption
      }
    })
    .filter(image => !!image.src)
})

const featuredImage = computed(() => images.value[0] ?? null)
const supportingImages = computed(() => images.value.slice(1))

const accentVar = computed(() => {
  switch (props.accent) {
    case 'soft': return 'var(--color-secondary)'
    case 'neutral': return 'var(--color-text)'
    default: return 'var(--color-primary)'
  }
})

const isFilled = computed(() => props.background !== 'surface')

const containerStyle = computed(() => {
  if (!isFilled.value) return {}
  if (props.background === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${accentVar.value}, color-mix(in srgb, ${accentVar.value} 60%, var(--color-secondary)))`
    }
  }
  return { background: accentVar.value }
})

const eyebrowColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)')
const headingColor = computed(() => isFilled.value ? '#fff' : 'var(--color-text)')
const mutedColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.78)' : 'var(--color-text-muted)')
const hairlineColor = computed(() => isFilled.value ? 'rgba(255,255,255,0.22)' : 'color-mix(in srgb, var(--color-text) 12%, transparent)')
const headerAlignClass = computed(() => props.align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl')

const gridColsClass = computed(() => {
  switch (props.columns) {
    case '2': return '@xl:grid-cols-2'
    case '4': return '@md:grid-cols-2 @xl:grid-cols-4'
    default: return '@sm:grid-cols-2 @xl:grid-cols-3'
  }
})

const masonryColsClass = computed(() => {
  switch (props.columns) {
    case '2': return '@xl:columns-2'
    case '4': return '@md:columns-2 @2xl:columns-4'
    default: return '@sm:columns-2 @xl:columns-3'
  }
})

const imageRatioClass = computed(() => {
  switch (props.imageRatio) {
    case 'square': return 'aspect-square'
    case 'portrait': return 'aspect-[3/4]'
    default: return 'aspect-[4/3]'
  }
})

function mosaicClass(index: number) {
  const pattern = index % 6
  if (pattern === 0) return '@xl:col-span-4 @xl:row-span-2'
  if (pattern === 1 || pattern === 2) return '@xl:col-span-2'
  return '@xl:col-span-3'
}

const activeIndex = ref<number | null>(null)
const activeImage = computed(() => activeIndex.value === null ? null : images.value[activeIndex.value] ?? null)
const closeButton = ref<HTMLButtonElement | null>(null)

function openLightbox(index: number) {
  if (!props.showLightbox) return
  activeIndex.value = index
}

function closeLightbox() {
  activeIndex.value = null
}

function showPrevious() {
  if (activeIndex.value === null || !images.value.length) return
  activeIndex.value = (activeIndex.value - 1 + images.value.length) % images.value.length
}

function showNext() {
  if (activeIndex.value === null || !images.value.length) return
  activeIndex.value = (activeIndex.value + 1) % images.value.length
}

function handleKeydown(event: KeyboardEvent) {
  if (activeIndex.value === null) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') showPrevious()
  if (event.key === 'ArrowRight') showNext()
}

watch(activeIndex, async (index) => {
  if (!import.meta.client) return
  document.body.style.overflow = index === null ? '' : 'hidden'
  if (index !== null) {
    await nextTick()
    closeButton.value?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    class="@container grid h-full gap-6 overflow-hidden"
    :class="isFilled ? 'rounded-2xl p-8' : ''"
    :style="containerStyle"
    data-testid="gallery-widget"
    :data-gallery-variant="variant"
  >
    <div :class="headerAlignClass">
      <p v-if="eyebrow" class="text-sm font-semibold" :style="{ color: eyebrowColor }">
        {{ eyebrow }}
      </p>
      <h2 class="tenant-heading mt-2 text-3xl font-bold" :style="{ color: headingColor }">
        {{ title }}
      </h2>
      <p v-if="intro" class="mt-3 leading-7" :style="{ color: mutedColor }">
        {{ intro }}
      </p>
    </div>

    <p v-if="!images.length" class="text-sm" :style="{ color: mutedColor }">
      Gallery images will appear here once they are added.
    </p>

    <!-- Masonry: legacy column layout -->
    <div v-else-if="variant === 'masonry'" class="columns-1 gap-4" :class="masonryColsClass" data-gallery-layout="masonry">
      <figure
        v-for="(image, index) in images"
        :key="`${image.src}-${index}`"
        class="mb-4 break-inside-avoid overflow-hidden rounded-lg"
        :style="{ boxShadow: `inset 0 0 0 1px ${hairlineColor}` }"
      >
        <button
          v-if="showLightbox"
          type="button"
          class="group block w-full cursor-zoom-in overflow-hidden text-left"
          :aria-label="`Open image: ${image.alt}`"
          @click="openLightbox(index)"
        >
          <img :src="image.src" :alt="image.alt" class="w-full object-cover transition duration-300 group-hover:scale-[1.02]" :class="imageRatioClass">
        </button>
        <img v-else :src="image.src" :alt="image.alt" class="w-full object-cover" :class="imageRatioClass">
        <figcaption v-if="showCaptions && image.caption" class="p-3 text-sm" :style="{ color: mutedColor }">
          {{ image.caption }}
        </figcaption>
      </figure>
    </div>

    <!-- Mosaic: editorial mixed-size composition -->
    <div v-else-if="variant === 'mosaic'" class="grid gap-4 @xl:auto-rows-[10rem] @xl:grid-cols-6" data-gallery-layout="mosaic">
      <figure
        v-for="(image, index) in images"
        :key="`${image.src}-${index}`"
        class="group relative min-h-56 overflow-hidden rounded-xl @xl:min-h-0"
        :class="mosaicClass(index)"
      >
        <button
          v-if="showLightbox"
          type="button"
          class="absolute inset-0 size-full cursor-zoom-in text-left"
          :aria-label="`Open image: ${image.alt}`"
          @click="openLightbox(index)"
        >
          <img :src="image.src" :alt="image.alt" class="size-full object-cover transition duration-300 group-hover:scale-[1.02]">
        </button>
        <img v-else :src="image.src" :alt="image.alt" class="absolute inset-0 size-full object-cover">
        <figcaption
          v-if="showCaptions && image.caption"
          class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:color-mix(in_srgb,black_80%,transparent)] to-transparent p-4 pt-10 text-sm font-medium text-[var(--color-surface)]"
        >
          {{ image.caption }}
        </figcaption>
      </figure>
    </div>

    <!-- Featured: lead image with supporting thumbnails -->
    <div v-else-if="variant === 'featured'" class="grid gap-4 @2xl:grid-cols-[2fr_1fr]" data-gallery-layout="featured">
      <figure v-if="featuredImage" class="group relative min-h-72 overflow-hidden rounded-2xl @2xl:min-h-[30rem]">
        <button
          v-if="showLightbox"
          type="button"
          class="absolute inset-0 size-full cursor-zoom-in text-left"
          :aria-label="`Open image: ${featuredImage.alt}`"
          @click="openLightbox(0)"
        >
          <img :src="featuredImage.src" :alt="featuredImage.alt" class="size-full object-cover transition duration-300 group-hover:scale-[1.02]">
        </button>
        <img v-else :src="featuredImage.src" :alt="featuredImage.alt" class="absolute inset-0 size-full object-cover">
        <figcaption
          v-if="showCaptions && featuredImage.caption"
          class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:color-mix(in_srgb,black_80%,transparent)] to-transparent p-6 pt-16 text-base font-semibold text-[var(--color-surface)]"
        >
          {{ featuredImage.caption }}
        </figcaption>
      </figure>
      <div v-if="supportingImages.length" class="grid grid-cols-2 gap-4">
        <figure
          v-for="(image, index) in supportingImages"
          :key="`${image.src}-${index + 1}`"
          class="group relative min-h-36 overflow-hidden rounded-xl"
        >
          <button
            v-if="showLightbox"
            type="button"
            class="absolute inset-0 size-full cursor-zoom-in text-left"
            :aria-label="`Open image: ${image.alt}`"
            @click="openLightbox(index + 1)"
          >
            <img :src="image.src" :alt="image.alt" class="size-full object-cover transition duration-300 group-hover:scale-[1.02]">
          </button>
          <img v-else :src="image.src" :alt="image.alt" class="absolute inset-0 size-full object-cover">
          <figcaption
            v-if="showCaptions && image.caption"
            class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color:color-mix(in_srgb,black_80%,transparent)] to-transparent p-3 pt-8 text-xs font-medium text-[var(--color-surface)]"
          >
            {{ image.caption }}
          </figcaption>
        </figure>
      </div>
    </div>

    <!-- Filmstrip: horizontally scrollable image rail -->
    <div v-else-if="variant === 'filmstrip'" class="min-w-0 overflow-x-auto pb-2" data-gallery-layout="filmstrip">
      <div class="flex w-max max-w-none gap-4">
        <figure
          v-for="(image, index) in images"
          :key="`${image.src}-${index}`"
          class="w-[78cqw] max-w-sm shrink-0 overflow-hidden rounded-xl @xl:w-80"
          :style="{ background: isFilled ? 'rgba(255,255,255,0.1)' : 'var(--color-surface)', boxShadow: `inset 0 0 0 1px ${hairlineColor}` }"
        >
          <button
            v-if="showLightbox"
            type="button"
            class="group block w-full cursor-zoom-in overflow-hidden text-left"
            :aria-label="`Open image: ${image.alt}`"
            @click="openLightbox(index)"
          >
            <img :src="image.src" :alt="image.alt" class="w-full object-cover transition duration-300 group-hover:scale-[1.02]" :class="imageRatioClass">
          </button>
          <img v-else :src="image.src" :alt="image.alt" class="w-full object-cover" :class="imageRatioClass">
          <figcaption v-if="showCaptions && image.caption" class="p-4 text-sm" :style="{ color: mutedColor }">
            {{ image.caption }}
          </figcaption>
        </figure>
      </div>
    </div>

    <!-- Grid: final legacy fallback -->
    <div v-else class="grid gap-4" :class="gridColsClass" data-gallery-layout="grid">
      <figure
        v-for="(image, index) in images"
        :key="`${image.src}-${index}`"
        class="overflow-hidden rounded-lg"
        :style="{ boxShadow: `inset 0 0 0 1px ${hairlineColor}` }"
      >
        <button
          v-if="showLightbox"
          type="button"
          class="group block w-full cursor-zoom-in overflow-hidden text-left"
          :aria-label="`Open image: ${image.alt}`"
          @click="openLightbox(index)"
        >
          <img :src="image.src" :alt="image.alt" class="w-full object-cover transition duration-300 group-hover:scale-[1.02]" :class="imageRatioClass">
        </button>
        <img v-else :src="image.src" :alt="image.alt" class="w-full object-cover" :class="imageRatioClass">
        <figcaption v-if="showCaptions && image.caption" class="p-3 text-sm" :style="{ color: mutedColor }">
          {{ image.caption }}
        </figcaption>
      </figure>
    </div>

    <Teleport to="body">
      <div
        v-if="activeImage"
        class="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Image viewer: ${activeImage.alt}`"
        @click.self="closeLightbox"
      >
        <button
          ref="closeButton"
          type="button"
          class="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-surface)_12%,transparent)] text-[var(--color-surface)] transition hover:bg-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)]"
          aria-label="Close image viewer"
          @click="closeLightbox"
        >
          <UIcon name="i-lucide-x" class="size-6" />
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-surface)_12%,transparent)] text-[var(--color-surface)] transition hover:bg-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)] @xl:left-6"
          aria-label="Previous image"
          @click="showPrevious"
        >
          <UIcon name="i-lucide-chevron-left" class="size-7" />
        </button>

        <figure class="grid max-h-[88vh] max-w-6xl gap-3">
          <img :src="activeImage.src" :alt="activeImage.alt" class="max-h-[78vh] max-w-full rounded-lg object-contain">
          <figcaption v-if="activeImage.caption" class="text-center text-sm text-[color:color-mix(in_srgb,var(--color-surface)_80%,transparent)]">
            {{ activeImage.caption }}
          </figcaption>
        </figure>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-surface)_12%,transparent)] text-[var(--color-surface)] transition hover:bg-[color:color-mix(in_srgb,var(--color-surface)_20%,transparent)] @xl:right-6"
          aria-label="Next image"
          @click="showNext"
        >
          <UIcon name="i-lucide-chevron-right" class="size-7" />
        </button>
      </div>
    </Teleport>
  </div>
</template>
