import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6 space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </main>
      <Footer />
    </div>
  )
}