import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto max-w-md px-4 md:px-6">
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </main>
      <Footer />
    </div>
  )
}