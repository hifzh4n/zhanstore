import { notFound } from 'next/navigation'
import { CheckCircle2, Layers, ShieldCheck, Timer } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ServiceContent = {
  title: string
  subtitle: string
  highlights: string[]
}

const serviceMap: Record<string, ServiceContent> = {
  'mobile-game-top-up': {
    title: 'Mobile Game Top-Up',
    subtitle: 'Top up your favorite mobile titles with fast fulfillment and transparent pricing.',
    highlights: ['Instant order processing', 'Popular global titles supported', 'Secure checkout and payment handling'],
  },
  'gift-cards': {
    title: 'Gift Cards',
    subtitle: 'Access digital gift cards for entertainment, games, and online subscriptions.',
    highlights: ['Wide catalog selection', 'Flexible denominations', 'Reliable digital delivery'],
  },
  'game-console': {
    title: 'Game Console Credits',
    subtitle: 'Purchase console wallet credits and subscriptions for leading gaming platforms.',
    highlights: ['Trusted source for digital codes', 'Fast and simple redemption flow', 'Regular promotional discounts'],
  },
  'mobile-recharge': {
    title: 'Mobile Recharge',
    subtitle: 'Reload mobile balances and prepaid services across supported carriers.',
    highlights: ['Easy account input flow', 'Regional availability support', 'Responsive customer assistance'],
  },
}

export function generateStaticParams() {
  return Object.keys(serviceMap).map((slug) => ({ slug }))
}

export default async function ServicePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const service = serviceMap[slug]

  if (!service) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-background py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{service.title}</h1>
            <p className="mt-4 max-w-3xl text-muted-foreground text-lg">{service.subtitle}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Layers className="h-5 w-5 text-primary" /> Service Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Why Customers Choose Zhan Store</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="flex items-center gap-2"><Timer className="h-4 w-4 text-primary" />Fast digital delivery for supported products.</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Reliable platform experience with secure purchase flow.</p>
                <p>Need assistance with this service? Visit the Help Center or Contact page for support.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
