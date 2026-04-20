import { Globe2, ShieldCheck, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-background py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Zhan Store</h1>
            <p className="mt-4 max-w-3xl text-muted-foreground text-lg">
              Zhan Store is a global digital commerce platform for instant game top-ups, gift cards, and entertainment credits.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <Globe2 className="h-6 w-6 text-primary" />
                <CardTitle>Global Coverage</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">Support for major titles and top-up products across multiple regions.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>Instant Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">Orders are processed quickly so players can get back in the game right away.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="h-6 w-6 text-primary" />
                <CardTitle>Trusted Checkout</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">Secure purchase flow and transparent pricing for every transaction.</CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
