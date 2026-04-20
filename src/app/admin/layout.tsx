import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/sidebar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(120deg,#f5f7f9_0%,#eef7f2_50%,#f7f4ee_100%)]">
      <div className="flex w-full flex-col lg:min-h-screen lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
