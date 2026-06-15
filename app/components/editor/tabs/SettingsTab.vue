<script setup lang="ts">
const editor = useHomepageEditor()

const domain = ref('')
const navItems = ref<Array<{ id: string, label: string, href: string }>>([])

watchEffect(() => {
  domain.value = (editor.tenant.value?.domain as string | undefined) ?? ''
  navItems.value = JSON.parse(JSON.stringify((editor.tenant.value?.navItems as any[]) ?? []))
})
</script>

<template>
  <div class="grid gap-6">
    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Domain
        </h2>
      </div>

      <UFormField label="Subdomain">
        <UInput
          :model-value="`${editor.tenant.value?.slug}.msaas.test`"
          readonly
          icon="i-lucide-globe"
        />
      </UFormField>

      <UFormField label="Custom domain">
        <UInput
          v-model="domain"
          icon="i-lucide-link"
          placeholder="www.example-mosque.org"
        />
      </UFormField>
    </section>

    <section class="grid gap-3">
      <div>
        <h2 class="text-sm font-semibold text-default">
          Navigation
        </h2>
      </div>

      <div class="grid gap-2">
        <div
          v-for="item in navItems"
          :key="item.id"
          class="grid grid-cols-[1fr_1fr] gap-2 rounded-md border border-muted bg-default p-2"
        >
          <UInput
            v-model="item.label"
            aria-label="Navigation label"
          />
          <UInput
            v-model="item.href"
            aria-label="Navigation URL"
          />
        </div>
      </div>
    </section>
  </div>
</template>
