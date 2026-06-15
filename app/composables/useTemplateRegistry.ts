import type { TemplateDefinition } from '~~/types/template'

export function useTemplateRegistry() {
  const templates = useState<TemplateDefinition[]>('templates', () => [])
  const loading = useState('templatesLoading', () => false)

  async function loadTemplates() {
    if (templates.value.length) return templates.value

    loading.value = true
    try {
      templates.value = await $fetch<TemplateDefinition[]>('/api/templates')
      return templates.value
    } finally {
      loading.value = false
    }
  }

  function getTemplate(id?: string) {
    return templates.value.find(template => template.id === id) ?? templates.value[0]
  }

  return {
    templates,
    loading,
    loadTemplates,
    getTemplate
  }
}
