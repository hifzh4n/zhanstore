import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 space-y-10 py-12">
        <section className="container mx-auto grid gap-8 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-14 w-full max-w-xl" />
            <Skeleton className="h-6 w-full max-w-lg" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-28 rounded-full" />
            </div>
          </div>
          <Skeleton className="aspect-video rounded-2xl" />
        </section>

        <section className="container mx-auto px-4 md:px-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-2xl" />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}