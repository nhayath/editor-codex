export function parsePipeRows(value: unknown, columns = 3) {
  if (typeof value !== 'string') return []

  return value
    .split('\n')
    .map(row => row.trim())
    .filter(Boolean)
    .map((row) => {
      const parts = row.split('|').map(part => part.trim())
      return Array.from({ length: columns }, (_, index) => parts[index] ?? '')
    })
}

export function parseLines(value: unknown) {
  if (typeof value !== 'string') return []

  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}
