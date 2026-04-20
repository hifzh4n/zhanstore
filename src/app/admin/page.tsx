import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminStatCard } from '@/components/admin/stat-card'
import { AdminSetupNotice } from '@/components/admin/setup-notice'
import { AdminCurrencySwitcher } from '@/components/admin/currency-switcher'
import { convertAdminAmount, formatAdminAmount, getAdminConfigState, getAdminOrders, getAdminSummary, parseAdminCurrency } from '@/lib/admin-dashboard'

type AdminPageProps = {
  searchParams?: Promise<{ currency?: string }>;
}

export default async function AdminOverviewPage({ searchParams }: AdminPageProps) {
  const params = await searchParams
  const currency = parseAdminCurrency(params?.currency)
  const config = getAdminConfigState()
  if (!config.ready) {
    return <AdminSetupNotice missingVars={config.missingVars} />
  }

  const [summary, orders] = await Promise.all([getAdminSummary(), getAdminOrders()])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time operational view from Supabase PostgreSQL.</p>
        </div>
        <AdminCurrencySwitcher currency={currency} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard title="Products" value={String(summary.productCount)} hint="Active and inactive catalog entries" />
        <AdminStatCard title="Packages" value={String(summary.packageCount)} hint="Top-up denominations" />
        <AdminStatCard title="Customers" value={String(summary.customerCount)} hint="Supabase auth users" />
        <AdminStatCard title="Transactions" value={String(summary.orderCount)} hint={`${summary.pendingOrders} pending orders`} />
        <AdminStatCard title={`Revenue (${currency})`} value={formatAdminAmount(summary.paidRevenueUsd, currency)} hint="Paid orders only" />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">External ID</th>
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Currency</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="px-2 py-2 font-mono text-xs">{order.external_id}</td>
                  <td className="px-2 py-2">{order.customer_name}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        order.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.status === 'Failed'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-2">{convertAdminAmount(Number(order.total), currency).toFixed(2)}</td>
                  <td className="px-2 py-2">{order.currency}</td>
                  <td className="px-2 py-2">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
