<script setup lang="ts">
const props = defineProps<{
  tenant?: Record<string, any> | null
  templateId?: string
  style?: string
}>()

const year = new Date().getFullYear()
const navItems = computed(() => props.tenant?.navItems ?? [])
</script>

<template>
  <footer class="@container !bg-[var(--color-primary)] py-14 text-white">
    <div class="tenant-container grid gap-10 @2xl:grid-cols-[1.2fr_0.8fr_0.9fr]">
      <div>
        <p class="tenant-heading text-3xl font-bold text-white">
          {{ tenant?.name }}
        </p>
        <p class="mt-4 max-w-lg text-sm font-medium leading-7 text-white/72">
          {{ tenant?.settings?.aboutText || 'A calmer, sharper mosque homepage for prayer, events, giving, and community updates.' }}
        </p>
      </div>

      <div>
        <h2 class="tenant-heading text-xl font-bold text-[var(--color-secondary)]">
          Site
        </h2>
        <nav class="mt-4 grid gap-3 text-sm font-bold text-white/74">
          <NuxtLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.href"
            class="hover:text-white"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div>
        <h2 class="tenant-heading text-xl font-bold text-[var(--color-secondary)]">
          Visit
        </h2>
        <div class="mt-4 grid gap-3 text-sm font-medium leading-6 text-white/72">
          <span>{{ tenant?.settings?.address }}</span>
          <span>{{ tenant?.settings?.city }} {{ tenant?.settings?.postcode }}</span>
          <span>{{ tenant?.settings?.email }}</span>
          <span>{{ tenant?.settings?.phone }}</span>
        </div>
      </div>
    </div>

    <div class="tenant-container mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6 text-xs font-semibold text-white/62">
      <span>© {{ year }} {{ tenant?.name }}</span>
      <div class="flex items-center gap-2">
        <UButton
          v-if="tenant?.settings?.facebook"
          :to="tenant.settings.facebook"
          target="_blank"
          color="neutral"
          variant="ghost"
          icon="i-lucide-facebook"
          size="xs"
          class="text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Facebook"
        />
        <UButton
          v-if="tenant?.settings?.instagram"
          :to="tenant.settings.instagram"
          target="_blank"
          color="neutral"
          variant="ghost"
          icon="i-lucide-instagram"
          size="xs"
          class="text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Instagram"
        />
        <UButton
          v-if="tenant?.settings?.youtube"
          :to="tenant.settings.youtube"
          target="_blank"
          color="neutral"
          variant="ghost"
          icon="i-lucide-youtube"
          size="xs"
          class="text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="YouTube"
        />
      </div>
    </div>
  </footer>
</template>
