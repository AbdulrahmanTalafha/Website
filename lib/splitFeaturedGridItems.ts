/**
 * Split items into rows for featured + side grid layout.
 * Each row: 1 big card (left) + up to 2 small cards (right).
 * e.g. 9 items → 3 rows (3 big + 6 small).
 */
export interface FeaturedGridRow<T> {
  featured: T
  side: T[]
}

export function splitFeaturedGridRows<T>(items: T[]): FeaturedGridRow<T>[] {
  if (items.length === 0) return []

  const rows: FeaturedGridRow<T>[] = []

  for (let i = 0; i < items.length; i += 3) {
    const chunk = items.slice(i, i + 3)
    rows.push({
      featured: chunk[0],
      side: chunk.slice(1),
    })
  }

  return rows
}
