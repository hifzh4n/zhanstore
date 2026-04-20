import Link from 'next/link'
import { Compass, Home, SearchX } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-muted/40 to-background">
        <section className="container mx-auto px-4 md:px-6 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SearchX className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">404 Error</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">Page Not Found</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              The page you are looking for does not exist or has been moved.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/">
                <Button className="cursor-pointer"><Home className="mr-2 h-4 w-4" />Back to Home</Button>
              </Link>
              <Link href="/deals">
                <Button variant="outline" className="cursor-pointer"><Compass className="mr-2 h-4 w-4" />Browse Deals</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
