import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-10">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 space-y-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-56" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Skeleton className="h-72 rounded-xl lg:col-span-2" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}