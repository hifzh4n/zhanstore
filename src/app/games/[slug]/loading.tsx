import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 pb-20">
        <Skeleton className="h-80 w-full rounded-none" />
        <div className="container mx-auto -mt-24 px-4 md:px-6 relative z-10 space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <Skeleton className="h-[28rem] rounded-2xl lg:col-span-1" />
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}