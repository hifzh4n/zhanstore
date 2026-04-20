import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(120deg,#f5f7f9_0%,#eef7f2_50%,#f7f4ee_100%)]">
      <Navbar />

      <div className="flex w-full flex-1 flex-col lg:min-h-[calc(100vh-72px)] lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <Footer />
    </div>
  )
}
