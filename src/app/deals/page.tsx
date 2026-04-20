import Link from 'next/link'
import { Flame, Percent, Sparkles, Tag } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Special Deals | Zhan Store',
  description: 'Browse limited-time promotions, bonus credits, and discount codes on Zhan Store.',
}

const featuredDeals = [
  { title: 'PUBG Mobile UC Bonus', description: 'Get up to 15% extra UC on selected bundles.', discount: 'Up to 15% Off', href: '/games/pubg-mobile' },
  { title: 'Mobile Legends Diamonds', description: 'Weekend-only discount for top-up packages.', discount: '10% Off', href: '/games/mobile-legends' },
  { title: 'Valorant Points Mega Drop', description: 'Limited campaign with fast checkout savings.', discount: '12% Off', href: '/games/valorant' },
]

const promoCodes = [
  { code: 'ZHAN10', detail: '10% off for first purchase above $10' },
  { code: 'TOPUP5', detail: '5% off all mobile top-up products' },
  { code: 'WEEKEND15', detail: '15% off selected titles every weekend' },
]

export default function DealsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-orange-100/60 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">Special Deals</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Save More On Every Top-Up</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground text-lg">
              Discover rotating discounts, bonus credits, and limited promotions curated by Zhan Store.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex items-center gap-3">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured Promotions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredDeals.map((deal) => (
                <Card key={deal.title} className="border-primary/20">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit border-primary/40 text-primary">{deal.discount}</Badge>
                    <CardTitle className="text-xl">{deal.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{deal.description}</p>
                    <Link href={deal.href}>
                      <Button className="w-full cursor-pointer">Shop Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/40 py-14">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex items-center gap-3">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Promo Codes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {promoCodes.map((promo) => (
                <Card key={promo.code} className="border-dashed border-primary/40">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Use Code</p>
                    <p className="text-2xl font-extrabold text-primary tracking-wide">{promo.code}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{promo.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border bg-background p-6">
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-primary" />
                <p className="text-sm md:text-base">Offers update daily and may vary by game and region.</p>
              </div>
              <Link href="/">
                <Button variant="outline" className="cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4" /> Explore Catalog
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
