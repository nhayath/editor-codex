import type { WidgetDefinition } from '~~/types/widget'

export function useWidgetRegistry() {
  const widgets = useState<WidgetDefinition[]>('widgets', () => [])
  const loading = useState('widgetsLoading', () => false)

  async function loadWidgets() {
    if (widgets.value.length) return widgets.value

    loading.value = true
    try {
      widgets.value = await $fetch<WidgetDefinition[]>('/api/widgets')
      return widgets.value
    } finally {
      loading.value = false
    }
  }

  function getWidget(id?: string) {
    return widgets.value.find(widget => widget.id === id)
  }

  return {
    widgets,
    loading,
    loadWidgets,
    getWidget
  }
}
