import Link from 'next/link'
import { SearchX } from 'lucide-react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { gamesData } from '@/lib/data'
import { filterAndRankGames, normalizeSearchQuery } from '@/lib/search'

export const metadata = {
  title: 'Search Catalog | Zhan Store',
  description: 'Search games, gift cards, and top-up products on Zhan Store.',
}

type SearchPageProps = Readonly<{
  searchParams: Promise<{ q?: string }>
}>

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams
  const query = normalizeSearchQuery(q)
  const results = filterAndRankGames(gamesData, query)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Search Catalog</h1>
          <p className="mt-3 text-muted-foreground">
            {query ? `Results for "${q}"` : 'Showing all available games and top-up products.'}
          </p>

          {results.length === 0 ? (
            <div className="mt-10 rounded-xl border bg-background p-10 text-center">
              <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No results found</h2>
              <p className="mt-2 text-muted-foreground">Try another keyword such as PUBG, Valorant, or Mobile Legends.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((game) => (
                <Link key={game.slug} href={`/games/${game.slug}`}>
                  <Card className="h-full border-none shadow-sm hover:shadow-md transition-all p-5 cursor-pointer bg-background">
                    <div className="flex items-center gap-4">
                      <Image src={game.icon} alt={game.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{game.name}</h3>
                        <p className="text-sm text-muted-foreground">{game.publisher}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
