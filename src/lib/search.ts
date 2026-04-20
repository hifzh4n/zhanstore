import { gamesData } from './data'

type Game = (typeof gamesData)[number]

export function normalizeSearchQuery(value: string) {
  return value.trim().toLowerCase()
}

export function scoreGameForQuery(game: Game, query: string) {
  const normalizedQuery = normalizeSearchQuery(query)

  if (!normalizedQuery) {
    return 1
  }

  const name = game.name.toLowerCase()
  const publisher = game.publisher.toLowerCase()
  const slug = game.slug.toLowerCase()
  const region = game.region.toLowerCase()
  const description = game.description.toLowerCase()
  const itemNames = game.items.map((item) => item.name.toLowerCase())

  let score = 0

  if (name === normalizedQuery) score += 120
  if (name.startsWith(normalizedQuery)) score += 80
  if (slug === normalizedQuery) score += 95
  if (slug.includes(normalizedQuery)) score += 50
  if (publisher.includes(normalizedQuery)) score += 30
  if (region.includes(normalizedQuery)) score += 20
  if (description.includes(normalizedQuery)) score += 10

  for (const itemName of itemNames) {
    if (itemName === normalizedQuery) score += 35
    if (itemName.includes(normalizedQuery)) score += 15
  }

  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean)
  if (queryParts.length > 1 && queryParts.every((part) => name.includes(part) || publisher.includes(part) || slug.includes(part))) {
    score += 25
  }

  return score
}

export function filterAndRankGames(games: Game[], query: string) {
  const normalizedQuery = normalizeSearchQuery(query)

  return games
    .map((game) => ({
      game,
      score: scoreGameForQuery(game, normalizedQuery),
      matches: normalizedQuery ? `${game.name} ${game.publisher} ${game.slug} ${game.region} ${game.description} ${game.items.map((item) => item.name).join(' ')}`.toLowerCase().includes(normalizedQuery) : true,
    }))
    .filter((entry) => entry.matches)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.game)
}