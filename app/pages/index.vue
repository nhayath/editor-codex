<script setup lang="ts">
const { data: tenants, pending, error } = await useAsyncData('tenants', () => $fetch('/api/tenant'))

function templateThumbnail(templateId?: string) {
  return `/templates/${templateId || 'classic'}.svg`
}
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-primary">
          MSaaS
        </p>
        <h1 class="text-2xl font-semibold text-default">
          Tenant websites
        </h1>
      </div>
      <UBadge color="neutral" variant="soft">
        Dev
      </UBadge>
    </div>

    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-circle-alert"
      title="Unable to load tenants"
      :description="error.message"
    />

    <div
      v-else-if="pending"
      class="grid gap-4 md:grid-cols-3"
    >
      <USkeleton
        v-for="index in 3"
        :key="index"
        class="h-64"
      />
    </div>

    <div
      v-else
      class="grid gap-4 md:grid-cols-3"
    >
      <UCard
        v-for="tenant in tenants"
        :key="tenant.id"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="grid size-10 place-items-center rounded-md bg-primary text-inverted">
              <UIcon name="i-lucide-moon-star" class="size-5" />
            </div>
            <div class="min-w-0">
              <h2 class="truncate text-base font-semibold text-default">
                {{ tenant.name }}
              </h2>
              <p class="truncate text-sm text-muted">
                {{ tenant.domain || `${tenant.slug}.msaas.test` }}
              </p>
            </div>
          </div>
        </template>

        <img
          :src="templateThumbnail(tenant.homepageConfig?.templateId)"
          :alt="tenant.name"
          class="aspect-[16/10] w-full rounded-md object-cover"
        >

        <template #footer>
          <div class="flex items-center justify-between gap-2">
            <UButton
              :to="`/site/${tenant.slug}`"
              color="neutral"
              variant="outline"
              icon="i-lucide-eye"
              label="Site"
            />
            <UButton
              :to="`/editor/${tenant.slug}`"
              icon="i-lucide-pencil-ruler"
              label="Editor"
            />
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
