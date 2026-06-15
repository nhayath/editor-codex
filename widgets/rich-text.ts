import type { WidgetDefinition } from '~~/types/widget'

export const richTextWidget: WidgetDefinition = {
  id: 'rich-text',
  name: 'Rich Text',
  icon: 'i-lucide-text',
  description: 'Formatted content using the Nuxt UI Tiptap editor field.',
  category: 'content',
  component: 'WidgetRichText',
  propSchema: [
    { key: 'content', label: 'Content', type: 'richtext', default: '<h2>Welcome</h2><p>Edit this section with the rich text editor.</p>' }
  ]
}
